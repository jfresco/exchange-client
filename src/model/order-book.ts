import { first, last, sortBy, map, pick } from 'lodash'

function Order (order: Order): Order {
  return pick(order, ['volume', 'price'])
}

function sumVolume (total: number, value: Order) {
  return total + value.volume
}

function Orders (items: Order[], depthFilter: DepthFilterFunction): OrderInfo {
  return {
    orders: items,
    totalVolume: items.reduce(sumVolume, 0),
    depth: function (price) {
      return items.filter(depthFilter(price)).reduce(sumVolume, 0)
    }
  }
}

function Asks (asks: Ask[]): OrderInfo {
  return Orders(asks, price => order => order.price <= price)
}

function Bids (bids: Bid[]): OrderInfo {
  return Orders(bids, price => order => order.price >= price)
}

export function OrderBook ({ asks, bids }: { asks: Ask[], bids: Bid[] }): OrderBook {
  const highestBid = last(sortBy(map(bids, 'price'))) || 0
  const lowestAsk = first(sortBy(map(asks, 'price'))) || 0
  const spread = highestBid - lowestAsk

  return {
    asks: Asks(asks),
    bids: Bids(bids),
    highestBid,
    lowestAsk,
    spread
  }
}

function factory (orderMapper: OrderMapperFunction) {
  return function (data: { asks: Order[], bids: Order[] }) {
    return OrderBook({
      asks: data.asks.map(orderMapper(Order)),
      bids: data.bids.map(orderMapper(Order))
    })
  }
}

export const orderBookFromKraken = factory(Type => ([price, volume]) => Type({ volume: +volume, price: +price }))
export const orderBookFromBitfinex = factory(Type => ({ price, amount }) => Type({ volume: +amount, price: +price }))
