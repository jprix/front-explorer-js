import { FrontApi } from '@front-finance/api';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const { symbol, BrokerType, UserId } = req.query;
  const { transferOptions, amountInFiat } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const bodyObject = {
    UserId: UserId,
  };

  if (BrokerType !== 'deFiWallet') {
    bodyObject.BrokerType = BrokerType;
  }

  if (transferOptions && Object.keys(transferOptions).length > 0) {
    bodyObject.transferOptions = transferOptions;
  }
  if (amountInFiat) bodyObject.amountInFiat = amountInFiat;
  if (symbol) bodyObject.symbol = symbol;

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });

  try {
    const getCatalogLink =
      await api.managedAccountAuthentication.v1LinktokenCreate(bodyObject);

    if (getCatalogLink.status !== 200) {
      const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${getCatalogLink.message}`;
      throw new Error(errorMessage);
    }

    return res.status(200).json(getCatalogLink.data);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
