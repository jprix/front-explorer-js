export const getUserId = (brokerType) => {
  console.log('get userId', brokerType);
  switch (brokerType) {
    case 'coinbase':
      return 'coin666666';
    case 'deFiWallet':
      return 'meta111111';
    case 'robinhood':
      return 'robin123456';
    case 'binance':
      return 'binance123';
    case 'alpaca':
      return 'alpaca123';
    default:
      return '000000001';
  }
};
