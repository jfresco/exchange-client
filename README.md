## Exchange client

### Goal

To better understand cryptocurrencies exchange APIs. This project will connect to Bitfinex and Kraken APIs,
get the order books for the pair ETH/BTC and list the orders needed to buy 10 BTC at the cheapest price.

### How to run this project

If this is your first time, you'll need to accomplish three steps:

1. Clone this repository
2. Configure your exchanges credentials
3. Run the app

#### 1. Clone the repo
It's just a standard GitHub repo, so you just need to
```
git clone git@github.com:jfresco/exchange-client.git
```

#### 2. Configure your credentials

You'll need to set up your exchanges credentials. This project won't work if you forget to provide some of
them.

Once you get your API key and secret from both Bitfinex and Kraken, just `cp config.json.example config.json`,
edit your new `config.json` file, and put the credentials there.
The file is ignored by `.git` in order to prevent accidentally pushing your credentials to a public repo.
Please keep them secret.

#### 3. Run the app
Don't forget to install the dependencies:
```
npm i
```

Then run the app:
```
npm start
```

If you want to see more debugging logs, run the app like this:
```
DEBUG=exchange:* npm start
```

Also, you can run the linter:
```
npm t
```

(eventually this will run some unit tests).

### Contributing

Open an issue or submit a pull request!

### License

MIT.
