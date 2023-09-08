export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const {
    EnableTransfers,
    amountInFiat,
    symbol,
    UserId,
    CallbackUrl,
    BrokerType,
  } = req.query;

  console.log('CallbackUrl', CallbackUrl);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  };

  if (EnableTransfers) {
    options.method = 'POST';
    options.body = JSON.stringify(req.body);
  }

  // Conditionally building the URL
  let queryString = `${MESH_API_URL}/api/v1/cataloglink?UserId=${UserId}&EnableTransfers=${EnableTransfers}`;
  if (CallbackUrl) {
    queryString += `&CallbackUrl=${CallbackUrl}`;
  }

  if (BrokerType) {
    queryString += `&BrokerType=${BrokerType}`;
  }

  if (amountInFiat) {
    queryString += `&amountInFiat=${amountInFiat}`;
  }

  if (symbol) {
    queryString += `&symbol=${symbol}`;
  }

  try {
    const getCatalogLink = await fetch(queryString, options);

    if (!getCatalogLink.ok) {
      const responseBody = await getCatalogLink.json();
      const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${responseBody.message}`;
      throw new Error(errorMessage);
    }

    const response = await getCatalogLink.json();
    return res.status(200).json(response);
  } catch (error) {
    console.log('Error from Mesh:', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
