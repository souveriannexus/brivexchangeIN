import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { storage, ClientConnection } from "./storage";
import { randomBytes } from "crypto";

// Message types
type WebSocketMessage = {
  type: string;
  data: any;
};

export function setupWebSocketServer(server: Server) {
  // Create WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Connection handler
  wss.on('connection', (ws: WebSocket) => {
    // Generate a unique client ID
    const clientId = randomBytes(16).toString('hex');
    
    // Store client connection
    storage.addClient(clientId, {
      ws,
      subscriptions: new Set(),
    });

    // Send connection acknowledgment
    sendMessage(ws, {
      type: 'connection',
      data: { status: 'connected', clientId }
    });

    // Message handler
    ws.on('message', (messageBuffer) => {
      try {
        // Convert buffer to string if needed
        const messageString = messageBuffer.toString();
        console.log(`Received WebSocket message from client ${clientId}:`, messageString);
        
        const { type, data } = JSON.parse(messageString) as WebSocketMessage;
        console.log(`Parsed message - type: ${type}, data:`, data);
        
        handleClientMessage(clientId, type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        sendMessage(ws, {
          type: 'error',
          data: { message: 'Invalid message format' }
        });
      }
    });

    // Close handler
    ws.on('close', () => {
      // Remove client connection
      storage.removeClient(clientId);
      console.log(`WebSocket client disconnected: ${clientId}`);
    });

    console.log(`WebSocket client connected: ${clientId}`);
  });

  // Start sending market updates
  startMarketDataUpdates();

  console.log('WebSocket server initialized');
}

// Handle incoming client messages
function handleClientMessage(clientId: string, type: string, data: any) {
  const client = storage.getClient(clientId);
  if (!client) return;

  switch (type) {
    case 'subscribe':
      handleSubscription(client, data.channel);
      break;
    case 'unsubscribe':
      handleUnsubscription(client, data.channel);
      break;
    case 'authenticate':
      handleAuthentication(client, data.userId);
      break;
    default:
      sendMessage(client.ws, {
        type: 'error',
        data: { message: 'Unknown message type' }
      });
  }
}

// Handle channel subscriptions
function handleSubscription(client: ClientConnection, channel: string) {
  console.log(`Client subscribed to channel: ${channel}`);
  client.subscriptions.add(channel);
  sendMessage(client.ws, {
    type: 'subscribed',
    data: { channel }
  });
}

// Handle channel unsubscriptions
function handleUnsubscription(client: ClientConnection, channel: string) {
  client.subscriptions.delete(channel);
  sendMessage(client.ws, {
    type: 'unsubscribed',
    data: { channel }
  });
}

// Handle client authentication
function handleAuthentication(client: ClientConnection, userId: number) {
  client.userId = userId;
  sendMessage(client.ws, {
    type: 'authenticated',
    data: { userId }
  });
}

// Send message to WebSocket client
function sendMessage(ws: WebSocket, message: WebSocketMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Broadcast message to all subscribed clients
function broadcastToChannel(channel: string, message: WebSocketMessage) {
  const clients = storage.getAllClients();
  let sentCount = 0;
  
  clients.forEach((client) => {
    if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
      sendMessage(client.ws, message);
      sentCount++;
    }
  });
  
  // Log broadcast information for debugging
  if (message.type === 'marketUpdate') {
    console.log(`Broadcasting ${message.type} to channel ${channel}, sent to ${sentCount}/${clients.size} clients`);
  }
}

// Simulate market data updates
function startMarketDataUpdates() {
  setInterval(async () => {
    try {
      // Get all trading pairs
      const tradingPairs = await storage.getAllTradingPairs();
      
      for (const pair of tradingPairs) {
        // Get current market data
        const marketData = await storage.getMarketData(pair.id);
        if (!marketData) continue;
        
        // Simulate more realistic price movement
        const currentPrice = parseFloat(marketData.lastPrice);
        
        // More realistic market simulation with possible trends
        const trend = Math.random() > 0.5 ? 1 : -1; // Randomly decide trend direction
        const volatility = 0.005; // Base volatility of 0.5%
        const momentum = Math.random() * 0.005; // Random momentum factor
        
        // Calculate price change with trend and volatility
        const priceChange = currentPrice * ((Math.random() * volatility * trend) + (momentum * trend));
        const newPrice = (currentPrice + priceChange).toFixed(8);
        
        // Generate new 24h high/low if appropriate
        const currentPriceStr = currentPrice.toString();
        let high24h = marketData.high24h ? parseFloat(marketData.high24h) : currentPrice;
        let low24h = marketData.low24h ? parseFloat(marketData.low24h) : currentPrice;
        
        if (parseFloat(newPrice) > high24h) {
          high24h = parseFloat(newPrice);
        }
        if (parseFloat(newPrice) < low24h) {
          low24h = parseFloat(newPrice);
        }
        
        // Update market data with new prices
        const updatedMarketData = await storage.updateMarketData(pair.id, {
          lastPrice: newPrice,
          high24h: high24h.toFixed(8),
          low24h: low24h.toFixed(8),
          updatedAt: new Date(),
        });
        
        // Broadcast to subscribers
        const channel = `market:${pair.baseCurrency.toLowerCase()}_${pair.quoteCurrency.toLowerCase()}`;
        broadcastToChannel(channel, {
          type: 'marketUpdate',
          data: updatedMarketData
        });
      }
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }, 2000); // Update every 2 seconds for a more responsive trading experience
}
