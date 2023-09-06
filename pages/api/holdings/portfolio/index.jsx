
export default async function handler(req, res) {
    const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;


  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST method.' });
  }

  const { UserId } = req.query;

  const payload = {
    UserId,
  }
 
  console.log(req.method, req.body)
  try {
    const response = await fetch(`${MESH_API_URL}/api/v1/holdings/portfolio`,
    {
    headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY
      },
        method: 'GET',
       
    }
    );
    console.log('response from mesh', response.status);
    if (!response.ok) {
        const responseBody = await response.json();
      const errorMessage = `Failed to fetch Portfolio Holdings. Status: ${response.status} - ${response.statusText}. Message: ${response.message}`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error from Mesh:', error);
    res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
  }
}
