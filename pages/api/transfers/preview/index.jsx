import { FrontApi } from '@front-finance/api';
export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  const payload = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    const executePreview =
      await api.managedTransfers.v1TransfersManagedPreviewCreate(payload);

    if (executePreview.status !== 200) {
      const errorMessage = `Failed to execute transfer preview. Status: ${executePreview.status} - ${executePreview.statusText}. Message: ${executePreview.message}`;
      return res.status(500).json({ error: errorMessage });
    }
    return res.status(200).json(executePreview.data);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
