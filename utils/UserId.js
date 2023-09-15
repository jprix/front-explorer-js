const userId = process.env.NEXT_PUBLIC_USER_ID;

export const getUserId = (brokerType) => {
  console.log('fetching user id', brokerType);
  switch (brokerType) {
    case 'coinbase':
      return `coin${userId}`;
    case 'deFiWallet':
      return `defi${userId}`;
    case 'defiWalletCoinbase':
      return `coinbaseWallet${userId}`;
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
