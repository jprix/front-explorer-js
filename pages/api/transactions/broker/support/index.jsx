export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const authToken = req.headers['authtoken'];

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = {
      authToken: authToken,
      type: req.query.brokerType,
    };

    console.log('payload', payload);
    const getSupportedFeatures = await fetch(
      `${MESH_API_URL}/api/v1/transactions/featureList`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': PROD_API_KEY,
        },
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    if (!getSupportedFeatures.ok) {
      throw new Error(
        `Failed to fetch Catalog Link: ${getSupportedFeatures.statusText}`
      );
    }
    const response = await getSupportedFeatures.json();
    return res.status(200).json(response.content);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
