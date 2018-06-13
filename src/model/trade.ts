import { sortBy, slice, last, dropRight, reverse } from 'lodash'

export default function Trade (orderBooks: OrderBooksByExchanges) {
  // Unified order book: contains all asks and bits of all the exchanges
  const unified: Unified = {
    asks: [],
    bids: []
  }

  Object.keys(orderBooks).forEach(exchange => {
    const withExchange = (order: Order): OrderWithExchange => ({
      ...order,
      exchange
    })

    unified.asks = [
      ...unified.asks,
      ...orderBooks[exchange].asks.orders.map(withExchange)
    ]

    unified.bids = [
      ...unified.bids,
      ...orderBooks[exchange].bids.orders.map(withExchange)
    ]
  })

  // Get the orders needed to sell the base currency in order to get the `expectedVolume`
  function sellByAmount(expectedVolume: number) {

    // Get the index of the last item that, with its predecessors, accumulates at least the `expectedVolume`
    function getIndexForAccum(bids: OrderWithExchange[]) {
      let i = 0

      for (let accum = 0; accum < expectedVolume && i < bids.length; i++) {
        const ask = bids[i]
        accum += ask.price * ask.volume
      }

      return i
    }

    // Get working orders
    function getBestBids() {
      const bids = reverse(sortBy(unified.bids, 'price'))
      const index = getIndexForAccum(bids)
      return slice(bids, 0, index)
    }

    function applyCorrectionToLastBid(orders: OrderWithExchange[]) {
      // A correction should be made to the last item of the array, assuming that the sum is passed from
      // `expectedVolume`.
      // XXX: I'm assuming here that the amount to sell to a bidder can be altered
      const untouched = dropRight(orders)
      const lastBid = last(orders)

      if (!lastBid) {
        return []
      }

      // Get the sum of all the orders except the last
      const sum = untouched.reduce((accum, x) => accum + x.volume * x.price, 0)

      // Calculate the volume needed for the last order to complete the expected volume
      lastBid.volume = (expectedVolume - sum) / lastBid.price

      // Return all orders
      return [...untouched, lastBid]
    }

    return applyCorrectionToLastBid(getBestBids())
  }

  return {
    sellByAmount
  }
}
