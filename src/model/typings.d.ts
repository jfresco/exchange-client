interface OrderInfo {
  orders: Order[]
  totalVolume: number
  depth: (price: number) => number
}

interface Order {
  volume: number
  price: number
}

type Ask = Order
type Bid = Order

interface OrderBook {
  asks: OrderInfo
  bids: OrderInfo
  highestBid: number
  lowestAsk: number
  spread: number
}

type DepthFilterFunction = (n: number) => (order: Order) => Boolean
type OrderMapperFunction = (type: Function) => (data: any) => Order


type OrderBooksByExchanges = {
  [key: string]: OrderBook
}

type OrderWithExchange = Order & {
  exchange: string
}

interface Unified {
  asks: OrderWithExchange[]
  bids: OrderWithExchange[]
}
