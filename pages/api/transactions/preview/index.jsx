export default async function handler(req, res) {
  const { PROD_API_KEY, MESH_API_URL, CLIENT_ID } = process.env;
  const authToken = req.headers['authtoken'];

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = {
      authToken: authToken,
      type: req.query.brokerType,
      symbol: req.query.symbol,
      paymentSymbol: req.query.paymentSymbol,
      amountIsInPaymentSymbol: false,
      amount: req.query.amount,
      isCryptoCurrency: true,
      paymentIsCryptoCurrency: false,
      orderType: req.query.orderType.slice(0, -4),
      timeInForce: req.query.timeInForce,
    };

    console.log('side ', req.query.side, 'payload', payload);
    const tradePreview = await fetch(
      `${MESH_API_URL}/api/v1/transactions/preview/${req.query.side}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': CLIENT_ID,
          'X-Client-Secret': PROD_API_KEY,
        },
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    if (!tradePreview.ok) {
      const errorText = await tradePreview.text();
      console.log('tradePreview not OK', errorText);
      throw new Error(
        `Failed to fetch trade Previe: ${tradePreview.statusText}`
      );
    }
    const response = await tradePreview.json();
    return res.status(200).json(response.content);
  } catch (error) {
    console.log('this was the error from Mesh', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
}
