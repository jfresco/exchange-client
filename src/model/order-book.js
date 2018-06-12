const { first, last, sortBy, map } = require('lodash')

function Order ({ volume, price }) {
  return {
    volume,
    price
  }
}

function Bid (params) {
  return Order(params)
}

function Ask (params) {
  return Order(params)
}

function sumVolume (total, value) {
  return total + value.volume
}

function Orders (items, depthFilter) {
  return {
    orders: items,
    totalVolume: items.reduce(sumVolume, 0),
    depth: function (price) {
      return items.filter(depthFilter(price)).reduce(sumVolume, 0)
    }
  }
}

function Asks (asks) {
  return Orders(asks, price => order => order.price <= price)
}

function Bids (bids) {
  return Orders(bids, price => order => order.price >= price)
}

function OrderBook ({ asks, bids }) {
  const highestBid = last(sortBy(map(bids, 'price')))
  const lowestAsk = first(sortBy(map(asks, 'price')))
  const spread = highestBid - lowestAsk

  return {
    asks: Asks(asks),
    bids: Bids(bids),
    highestBid,
    lowestAsk,
    spread
  }
}

function factory (orderMapper) {
  return function (data) {
    return OrderBook({
      asks: data.asks.map(orderMapper(Ask)),
      bids: data.bids.map(orderMapper(Bid))
    })
  }
}

OrderBook.fromKraken = factory(Type => ([price, volume]) => Type({ volume: +volume, price: +price }))
OrderBook.fromBitfinex = factory(Type => ({ price, amount }) => Type({ volume: +amount, price: +price }))

module.exports = OrderBook
