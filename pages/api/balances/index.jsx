export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use POST method.' });
  }

  const authToken = req.headers['authtoken'];
  const { brokerType } = req.query;

  const payload = {
    AuthToken: authToken,
    Type: brokerType,
  };

  try {
    const response = await fetch(`${MESH_API_URL}/api/v1/balance/get`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log('response from mesh', response);
    if (!response.ok) {
      const errorText = await response.json();
      const errorMessage = `Failed to fetch Balances. Status: ${errorText} - ${response.statusText}. Message: ${response.message}`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error from Mesh:', error);
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
