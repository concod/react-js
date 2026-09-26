export type Position = {
  symbol: string;
  quantity: number;
  price: number;
  pnl: number; // profit / loss
};

const positions: Position[] = [
  { symbol: "AAPL", quantity: 500, price: 189.45, pnl: 2340.5 },
  { symbol: "GOOGL", quantity: 120, price: 142.11, pnl: -890.25 },
  { symbol: "TSLA", quantity: 300, price: 248.5, pnl: 5120.0 },
  { symbol: "MSFT", quantity: 250, price: 411.22, pnl: 1204.75 },
  { symbol: "NVDA", quantity: 80, price: 875.3, pnl: -450.6 },
  { symbol: "AMZN", quantity: 200, price: 178.9, pnl: 980.4 },
];

export default function SortableTable() {
  // Build a sortable table here.
  // Core requirements:
  //  - render the positions in a table (symbol, quantity, price, pnl)
  //  - click a column header to sort by that column
  //  - click the same header again to toggle asc <-> desc
  //  - handle BOTH string (symbol) and number (qty/price/pnl) columns
  //  - show which column is sorted and in which direction (▲ / ▼)
  return (
    <div>
      <h1>Positions</h1>
      <p>{positions.length} positions — build the sortable table.</p>
    </div>
  );
}
