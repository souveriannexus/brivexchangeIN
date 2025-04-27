import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";
import { WebSocketMessage, SubscriptionChannel } from "@/lib/types";

type WebSocketContextType = {
  connected: boolean;
  subscribe: (channel: SubscriptionChannel) => void;
  unsubscribe: (channel: SubscriptionChannel) => void;
  subscriptions: Set<SubscriptionChannel>;
  lastMessage: WebSocketMessage | null;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Set<SubscriptionChannel>>(new Set());
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Connect to WebSocket server
  useEffect(() => {
    // Create WebSocket connection
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setConnected(true);
        console.log("WebSocket connected, readyState:", socket.readyState);
        
        // Add a slight delay before sending messages (ensure socket is fully ready)
        setTimeout(() => {
          console.log("Starting to send re-subscriptions, current readyState:", socket.readyState);
          
          // Re-subscribe to channels if reconnecting
          if (subscriptions.size > 0) {
            console.log(`Re-subscribing to ${subscriptions.size} channels:`, [...subscriptions]);
            subscriptions.forEach(channel => {
              console.log(`Re-subscribing to channel: ${channel}`);
              sendMessage({
                type: "subscribe",
                data: { channel },
              });
            });
          } else {
            console.log("No channels to re-subscribe to");
          }
          
          // Authenticate if user is logged in
          if (user) {
            console.log(`Authenticating user ID: ${user.id}`);
            sendMessage({
              type: "authenticate",
              data: { userId: user.id },
            });
          }
        }, 500);
      };
      
      socket.onclose = (event) => {
        setConnected(false);
        console.log(`WebSocket disconnected (${event.code}): ${event.reason}`);
        
        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000); // Reconnect after 5 seconds
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          
          // Debug logging for all messages
          if (message.type === 'marketUpdate') {
            console.log(`Received ${message.type} message for trading pair ID: ${message.data?.tradingPairId}`);
          } else {
            console.log(`Received WebSocket message of type: ${message.type}`);
          }
          
          setLastMessage(message);
          
          // Handle specific message types
          switch (message.type) {
            case "subscribed":
              console.log(`Successfully subscribed to channel: ${message.data.channel}`);
              setSubscriptions(prev => {
                const updated = new Set(prev);
                updated.add(message.data.channel);
                return updated;
              });
              break;
            case "unsubscribed":
              console.log(`Successfully unsubscribed from channel: ${message.data.channel}`);
              setSubscriptions(prev => {
                const updated = new Set(prev);
                updated.delete(message.data.channel);
                return updated;
              });
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    };
    
    connectWebSocket();
    
    // Clean up on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  // Re-authenticate when user changes
  useEffect(() => {
    if (connected && user && socketRef.current) {
      sendMessage({
        type: "authenticate",
        data: { userId: user.id },
      });
    }
  }, [connected, user]);
  
  // Send message to WebSocket server
  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(message);
      console.log(`Sending WebSocket message: ${messageString}`);
      socketRef.current.send(messageString);
      return true;
    } else {
      console.warn(`Failed to send WebSocket message: ${message.type} - Connection not open. Current readyState: ${socketRef.current?.readyState}`);
      return false;
    }
  };
  
  // Subscribe to a channel
  const subscribe = (channel: SubscriptionChannel) => {
    // Add to our tracking set first (even if we can't send now)
    setSubscriptions(prev => {
      const updated = new Set(prev);
      updated.add(channel);
      return updated;
    });
    
    // Try to send the message now if connection is open
    const success = sendMessage({
      type: "subscribe",
      data: { channel },
    });
    
    // If failed, we'll retry on reconnection via the subscriptions set
    if (!success) {
      console.log(`Queued subscription to ${channel} for when connection is ready`);
    }
  };
  
  // Unsubscribe from a channel
  const unsubscribe = (channel: SubscriptionChannel) => {
    // Remove from our local tracking first
    setSubscriptions(prev => {
      const updated = new Set(prev);
      updated.delete(channel);
      return updated;
    });
    
    // Try to send the unsubscribe message
    const success = sendMessage({
      type: "unsubscribe",
      data: { channel },
    });
    
    if (!success) {
      console.log(`Could not send unsubscribe message for ${channel}, but removed from local tracking`);
    }
  };
  
  return (
    <WebSocketContext.Provider
      value={{
        connected,
        subscribe,
        unsubscribe,
        subscriptions,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
