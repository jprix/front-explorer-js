export default async function handler(req, res) {

    const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;   
    

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const getCatalogLink = await fetch(
        `${MESH_API_URL}/api/v1/cataloglink?userId=${CLIENT_ID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': CLIENT_ID,
            'X-Client-Secret': PROD_API_KEY
          },
        }
      );
      if (!getCatalogLink.ok) {
        throw new Error(
          `Failed to fetch Catalog Link: ${getCatalogLink.statusText}`
        );
      }
      const response = await getCatalogLink.json();
      return res.status(200).json(response);
    } catch (error) {
      console.log('this was the error from Mesh', error);
      res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  }