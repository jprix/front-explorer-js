const userId = process.env.NEXT_PUBLIC_USER_ID;
const { v4: uuidv4 } = require('uuid');
//const defiId = uuidv4();

export const getUserId = (brokerType) => {
  console.log('hit getUserId function', brokerType);
  switch (brokerType) {
    case 'coinbase':
      return `coin${userId}`;
    case 'deFiWallet':
      return `defi${userId}`;

    case 'robinhood':
      return `robin${userId}`;
    case 'binance':
      return `binance${userId}`;
    case 'alpaca':
      return `alpaca${userId}`;
    default:
      return '000000007';
  }
};
