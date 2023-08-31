export default async function handler(req, res) {

    const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;  
    console.log('*** ' , req.method, req.body); // log the request method and body

    const payload = req.body;

    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const disconnectAccount = await fetch(
        `${MESH_API_URL}/api/v1/account`,
        {
          method: 'DELETE',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': CLIENT_ID,
            'X-Client-Secret': PROD_API_KEY
          },
        }
      );
      if (!disconnectAccount.ok) {
        throw new Error(
          `Failed to Disconnect account: ${disconnectAccount.statusText}`
        );
      }
      const response = await disconnectAccount.json();
      return res.status(200).json(response);
    } catch (error) {
      console.log('this was the error from Mesh', error);
      res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  }