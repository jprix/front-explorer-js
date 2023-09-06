export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;

  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'Method not allowed. Please use POST method.' });
  }

  //const { UserId } = req.query;

  const payload = {
    authToken:
      'dyHFM7zQVKg/H+ArTqbzKA==.xTf5s0tJuEl7U4cAsrtWa/dRwN0XKoC06KBUgsRO2le+fmb1wgSNM9iGFdcPf5Zc86Ht/PP+HOW2Jcruu10SXs9ztuLn5dBuvx4bOvxf8vHah2CkEieD04rBu7zAcNzR4X8Fpj52Yy5/1YL1r0i2QcCIYJCO5j8FcuzQCK5mfWiwsxakmBGRjW6P88cFaQyxBUi4ZKewwxiWN+1/7HSbzCBzS9bscTBAUSFbkBm7DfNUC2te4GbZIyBef6rXaWeK',
    type: 'coinbase',
  };

  console.log(payload);
  try {
    const response = await fetch(`${MESH_API_URL}/api/v1/holdings/get`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        'X-Client-Secret': PROD_API_KEY,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
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
    res
      .status(500)
      .json({ error: `An internal server error occurred: ${error.message}` });
  }
}
