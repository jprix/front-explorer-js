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

    console.log(payload);
    const tradeExecution = await fetch(
      `${MESH_API_URL}/api/v1/transactions/${req.query.side}`,
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
    if (!tradeExecution.ok) {
      const errorText = await tradeExecution.text();
      throw new Error(`Failed to executte trade: ${errorText}`);
    }
    const response = await tradeExecution.json();
    return res.status(200).json(response.content);
  } catch (error) {
    console.error('Error during trade execution:', error); // Use console.error for errors
    if (error.message.includes('Failed to execute trade')) {
      return res
        .status(502)
        .json({ error: `Trade execution failed: ${error.message}` });
    }

    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
