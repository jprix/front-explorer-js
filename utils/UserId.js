export const getUserId = (brokerType) => {
  switch (brokerType) {
    case 'coinbase':
      return 'coin15566779';
    case 'deFiWallet':
      return 'defi666779';
    case 'robinhood':
      return 'robin4436779';
    case 'binance':
      return 'binance666779';
    case 'alpaca':
      return 'alpaca666778';
    default:
      return '000000007';
  }
};
