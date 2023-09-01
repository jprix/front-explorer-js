export default async function handler(req, res) {
  console.log('*** hit preview ' , req.method, req.body); // log the request method and body

  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;  

  const payload = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const executePreview = await fetch(
      `${MESH_API_URL}/api/v1/transfers/managed/preview`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': PROD_API_KEY
        },
      }
    );
    if (!executePreview.ok) {
      const responseBody = await executePreview.json();
      console.error('Error response from Mesh API:', responseBody);
      const errorMessage = `Failed to execute transfer preview. Status: ${executePreview.status} - ${executePreview.statusText}. Message: ${responseBody.message}`;

      throw new Error(
        `Failed to Preview transfer: ${errorMessage}`
      );
    }
    const response = await executePreview.json();
    return res.status(200).json(response);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}