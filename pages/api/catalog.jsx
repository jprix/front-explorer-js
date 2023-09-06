export default async function handler(req, res) {

    const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;   
    
    const { enableTransfers } = req.query;
console.log(enableTransfers)
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const getCatalogLink = await fetch(
        `${MESH_API_URL}/api/v1/cataloglink?UserId=${CLIENT_ID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': CLIENT_ID,
            'X-Client-Secret': PROD_API_KEY
          },
        }
      );
      if (!getCatalogLink.ok) {
        const responseBody = await getCatalogLink.json();
        const errorMessage = `Failed to retrieve or generate catalogLink. Status: ${getCatalogLink.status} - ${getCatalogLink.statusText}. Message: ${responseBody.message}`;

        throw new Error(errorMessage);
      }
      const response = await getCatalogLink.json();
      return res.status(200).json(response);
    } catch (error) {
      console.log('this was the error from Mesh', error);
      res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  }