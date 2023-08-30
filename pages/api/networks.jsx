export default async function handler(req, res) {

    const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;   
    

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const getNetworks = await fetch(
        `${MESH_API_URL}/api/v1/transfers/managed/integrations`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': CLIENT_ID,
            'X-Client-Secret': PROD_API_KEY
          },
        }
      );
      if (!getNetworks.ok) {
        throw new Error(
          `Failed to fetch Catalog Link: ${getNetworks.statusText}`
        );
      }
      const response = await getNetworks.json();
      return res.status(200).json(response);
    } catch (error) {
      console.log('this was the error from Mesh', error);
      res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  }