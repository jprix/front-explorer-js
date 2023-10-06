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

  // Conditionally add other properties to the bodyObject
  if (transferOptions && Object.keys(transferOptions).length > 0) {
    bodyObject.transferOptions = transferOptions;
  }
  if (amountInFiat) bodyObject.amountInFiat = amountInFiat;
  if (symbol) bodyObject.symbol = symbol;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
    body: JSON.stringify(bodyObject),
    method: 'POST',
  };

  try {
    const getCatalogLink = await fetch(
      `${MESH_API_URL}/api/v1/linkToken`,
      options
    );

    if (!getCatalogLink.ok) {
      const responseBody = await getCatalogLink.json();
      const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${responseBody.message}`;
      throw new Error(errorMessage);
    }

    const response = await getCatalogLink.json();

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
