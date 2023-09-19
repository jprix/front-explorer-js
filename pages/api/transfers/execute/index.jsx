export default async function handler(req, res) {
  console.log('*** hit preview ', req.method, req.body); // log the request method and body

  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  const payload = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const executeTransfer = await fetch(
      `${MESH_API_URL}/api/v1/transfers/managed/execute`,
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
    if (!executeTransfer.ok) {
      const responseBody = await executeTransfer.json();
      const errorMessage = `Failed to execute transfer. Status: ${executeTransfer.status} - ${executeTransfer.statusText}. Message: ${responseBody.message}`;

      throw new Error(`Failed to Execute transfer: ${errorMessage}`);
    }
    const response = await executeTransfer.json();
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
