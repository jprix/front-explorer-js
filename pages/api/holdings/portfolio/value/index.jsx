import { getUserId } from '../../../../../utils/UserId';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use POST method.' });
  }

  const authToken = req.headers['authtoken'];
  const { brokerType } = req.query;
  const userId = getUserId(brokerType);

  const payload = {
    AuthToken: authToken,
    Type: brokerType,
  };

  console.log('outbound payload', payload, userId);
  try {
    const response = await fetch(`${MESH_API_URL}/api/v1/holdings/value`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log('response from mesh', response);
    if (!response.ok) {
      const responseBody = await response.json();
      const errorMessage = `Failed to fetch Portfolio Holdings. Status: ${response.status} - ${response.statusText}. Message: ${response.message}`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error from Mesh:', error);
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
