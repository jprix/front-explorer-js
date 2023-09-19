export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  console.log('*** ', req.method, req.body); // log the request method and body

  const payload = req.body;

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use POST method.' });
  }

  try {
    const depositAddress = await fetch(
      `${MESH_API_URL}/api/v1/transfers/address/get`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': PROD_API_KEY,
        },
      }
    );
    if (!depositAddress.ok) {
      const responseBody = await depositAddress.json();
      const errorMessage = `Failed to retrieve or generate a deposit address. Status: ${depositAddress.status} - ${depositAddress.statusText}. Message: ${responseBody.message}`;
      return res.status(500).json({ error: errorMessage });
    }
    const response = await depositAddress.json();
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error from Mesh:', error);
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
