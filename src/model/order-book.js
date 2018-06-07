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

function by (property, order = 'asc') {
  return function (a, b) {
    const index = order === 'asc' ? 1 : -1

    if (a[property] === b[property]) {
      return 0
    }

    if (a[property] < b[property]) {
      return -index
    }

    return index
  }
}

function OrderBook ({ asks, bids }) {
  const highestBid = [...bids].sort(by('price', 'desc'))[0].price
  const lowestAsk = [...asks].sort(by('price', 'asc'))[0].price
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
