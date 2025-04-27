import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { OpenOrder, Order } from "@/lib/types";
import { formatNumber, formatDate } from "@/lib/utils";
import { WS_CHANNELS } from "@/lib/constants";

interface OpenOrdersProps {
  tradingPairId?: number;
}

export function OpenOrders({ tradingPairId }: OpenOrdersProps) {
  const { toast } = useToast();
  const { subscribe, unsubscribe, lastMessage } = useWebSocket();
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  
  // Fetch user's open orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders', { status: 'open' }],
  });
  
  // Format and filter orders - use useMemo instead of useEffect to prevent infinite loops
  useEffect(() => {
    if (!orders) return;
    
    const formattedOrders: OpenOrder[] = orders
      .filter(order => !tradingPairId || order.tradingPairId === tradingPairId)
      .map(order => {
        // For simplicity, use mock symbol mapping based on tradingPairId
        const symbol = order.tradingPairId === 1 ? "BTC/USDT" :
                     order.tradingPairId === 2 ? "ETH/USDT" :
                     order.tradingPairId === 3 ? "BNB/USDT" :
                     order.tradingPairId === 4 ? "XRP/USDT" : "BRIV/USDT";
        
        return {
          id: order.id,
          symbol,
          type: order.type,
          side: order.side,
          price: order.price || "0",
          amount: order.amount,
          filled: order.filled,
          total: order.price ? (parseFloat(order.price) * parseFloat(order.amount)).toString() : "0",
          createdAt: order.createdAt,
        };
      });
    
    // Only update state if the orders have actually changed
    if (JSON.stringify(formattedOrders) !== JSON.stringify(openOrders)) {
      setOpenOrders(formattedOrders);
    }
  }, [orders, tradingPairId, openOrders]);
  
  // Subscribe to order updates via WebSocket
  useEffect(() => {
    subscribe(WS_CHANNELS.USER_ORDERS);
    
    return () => {
      unsubscribe(WS_CHANNELS.USER_ORDERS);
    };
  }, [subscribe, unsubscribe]);
  
  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'orderUpdate') {
      // Refresh orders when we get an update
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    }
  }, [lastMessage]);
  
  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await apiRequest("DELETE", `/api/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order cancelled",
        description: "Your order has been successfully cancelled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Cancel all orders
  const handleCancelAll = () => {
    if (openOrders.length === 0) return;
    
    // Confirm before cancelling all orders
    if (confirm("Are you sure you want to cancel all open orders?")) {
      // Cancel each order sequentially
      openOrders.forEach(order => {
        cancelOrderMutation.mutate(order.id);
      });
    }
  };
  
  // Cancel single order
  const handleCancelOrder = (orderId: number) => {
    cancelOrderMutation.mutate(orderId);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 border-b flex justify-between items-center">
        <h2 className="font-medium">Open Orders</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground"
          onClick={handleCancelAll}
          disabled={openOrders.length === 0 || cancelOrderMutation.isPending}
        >
          Cancel All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-6">
            <i className="fa-solid fa-spinner animate-spin text-xl mb-2"></i>
            <p className="text-sm">Loading orders...</p>
          </div>
        ) : openOrders.length > 0 ? (
          <div>
            <div className="grid grid-cols-7 gap-2 p-3 text-xs text-muted-foreground border-b">
              <div>Pair</div>
              <div>Type</div>
              <div>Side</div>
              <div>Price</div>
              <div>Amount</div>
              <div>Filled</div>
              <div></div>
            </div>
            {openOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-7 gap-2 p-3 text-xs border-b hover:bg-muted/10">
                <div>{order.symbol}</div>
                <div className="capitalize">{order.type}</div>
                <div className={order.side === 'buy' ? 'text-success' : 'text-destructive'}>
                  {order.side === 'buy' ? 'Buy' : 'Sell'}
                </div>
                <div className="font-mono">{formatNumber(order.price, 2)}</div>
                <div className="font-mono">{formatNumber(order.amount, 6)}</div>
                <div className="font-mono">{formatNumber(order.filled, 6)}</div>
                <div className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive/90"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <i className="fa-solid fa-clipboard-list text-2xl mb-2"></i>
            <p className="text-sm">No open orders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
