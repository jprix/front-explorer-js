export const getUserId = (userId) => {
  switch (userId) {
    case 'coinbase':
      return '123456789';
    case 'metamask':
      return 'meta123456';
    default:
      return '000000000';
  }
};
