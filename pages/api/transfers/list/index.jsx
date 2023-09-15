export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  try {
    const fetchTransfers = await fetch(
      `${MESH_API_URL}/api/v1/transfers/list`,
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
    if (!fetchTransfers.ok) {
      const responseBody = await fetchTransfers.json();
      console.error('Error response from Mesh API:', responseBody);
      const errorMessage = `Failed to Fetch Transfer details. Status: ${fetchTransfers.status} - ${fetchTransfers.statusText}. Message: ${responseBody.message}`;
      throw new Error(`Failed to Fetch Transfer details: ${errorMessage}`);
    }
    console.log('fetchTransfers', fetchTransfers);
    const response = await fetchTransfers.json();
    return res.status(200).json(response);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({
      error: `Something went wrong with Fetching transfer details: ${error}`,
    });
  }
}
