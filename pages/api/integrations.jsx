import { FrontApi } from '@front-finance/api';

export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'GET') {
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
    const getIntegrations =
      await api.managedTransfers.v1TransfersManagedIntegrationsList();

    if (getIntegrations.status !== 200) {
      throw new Error(
        `Failed to fetch Catalog Link: ${getIntegrations.statusText}`
      );
    }
    return res.status(200).json(getIntegrations.data);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
