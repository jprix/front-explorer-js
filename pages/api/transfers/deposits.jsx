import { FrontApi } from '@front-finance/api';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  const payload = req.body;

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use POST method.' });
  }

  const api = new FrontApi({
    baseURL: MESH_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': PROD_API_KEY,
    },
  });
  try {
    const depositAddress =
      await api.transfers.v1TransfersAddressGetCreate(payload);

    if (depositAddress.status !== 200) {
      console.error('Error from Mesh:', depositAddress);
      const errorMessage = `Failed to retrieve or generate a deposit address. Status: ${depositAddress.status} - ${depositAddress.statusText}. Message: ${depositAddress.message}`;
      return res.status(500).json({ error: errorMessage });
    }
    return res.status(200).json(depositAddress.data);
  } catch (error) {
    console.error('Error from Mesh:', error);
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
