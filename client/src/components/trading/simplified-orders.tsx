import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SimplifiedOrdersProps {
  tradingPairId?: number;
}

export function SimplifiedOrders({ tradingPairId }: SimplifiedOrdersProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 border-b flex justify-between items-center">
        <h2 className="font-medium">Open Orders</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground"
          disabled={true}
        >
          Cancel All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="text-center text-muted-foreground py-6">
          <i className="fa-solid fa-clipboard-list text-2xl mb-2"></i>
          <p className="text-sm">No open orders</p>
        </div>
      </CardContent>
    </Card>
  );
}