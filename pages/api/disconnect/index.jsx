export default async function handler(req, res) {
  const { method, body: payload } = req;
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;  

  if (method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const disconnectAccount = await fetch(`${MESH_API_URL}/api/v1/account`, {
      method: 'DELETE',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY
      },
    });

    if (!disconnectAccount.ok) {
      const responseBody = await disconnectAccount.json();
      const errorMessage = `Failed to disconnect account. Status: ${disconnectAccount.status} - ${disconnectAccount.statusText}. Message: ${responseBody.message}`;
      throw new Error(errorMessage);
    }

    const response = await disconnectAccount.json();
    return res.status(200).json(response);

  } catch (error) {
    console.log('Error from Mesh:', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
