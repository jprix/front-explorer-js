import React from 'react';

import {
  Card,
  CardContent,
  FormControl,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

const TradePreviewModal = ({
  brokerType,
  authToken,
  symbol,
  side,
  orderType,
  amount,
  timeInForce,
  paymentSymbol,
  setTradeStage,
  loadingExecution,
  setLoadingExecution,
  setTradeResponse,
}) => {
  const executeTrade = async () => {
    setLoadingExecution(true);
    try {
      const executeTrade = await fetch(
        `/api/transactions/execute?side=${side}&paymentSymbol=${paymentSymbol}&symbol=${symbol}&orderType=${orderType}&timeInForce=${timeInForce}&amount=${amount}&brokerType=${brokerType}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          method: 'POST',
        }
      );
      if (!executeTrade.ok) {
        setLoadingExecution(false);
        setTradeStage(1);
        const errorResponse = await executeTrade.json();
        alert(`Trade Failed: ${errorResponse.error}`);
        return;
      }
      const response = await executeTrade.json();
      await setTradeResponse(response);
      setTradeStage(3);

      setLoadingExecution(false);
    } catch (error) {
      console.log('this was the error from Mesh', error);
    }
  };

  return (
    <>
      {loadingExecution ? (
        <>
          <p>Executing Trade</p>
          <CircularProgress />
        </>
      ) : (
        <div>
          <Card
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mt: 2,
              gap: 2,
              p: 2,
            }}
          >
            {/* Added Card title */}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom align="center">
                Trade Preview
              </Typography>
              <form>
                <FormControl fullWidth>
                  <Typography variant="h6">Order Type</Typography>
                  <TextField
                    required
                    disabled
                    labelId="orderType-label"
                    id="orderType"
                    value={orderType}
                    label="Select Order Type"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">Select Symbol</Typography>
                  <TextField
                    required
                    labelId="symbol-label"
                    disabled
                    id="symbol"
                    value={symbol}
                    label="Select Symbol Type"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">Select Order Side</Typography>
                  <TextField
                    required
                    disabled
                    labelId="side-label"
                    id="side"
                    value={side}
                    label="Select Side Type"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">Amount</Typography>
                  <TextField
                    required
                    disabled
                    id="amount"
                    value={amount}
                    label="Amount"
                    helperText="Amount of purchase."
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">Time In force</Typography>
                  <TextField
                    required
                    disabled
                    labelId="symbol-label"
                    id="symbol"
                    value={timeInForce}
                    label="Select Symbol Type"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">Payment Symbol</Typography>
                  <TextField
                    required
                    disabled
                    id="payment-symbol"
                    value={paymentSymbol}
                  />
                </FormControl>
                <Grid container justifyContent="flex-end" mt={2}>
                  <Button
                    onClick={executeTrade}
                    variant="contained"
                    color="primary"
                  >
                    Place {symbol} Order
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

TradePreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brokerType: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  timeInForce: PropTypes.string.isRequired,
  paymentSymbol: PropTypes.string.isRequired,
  setTradeStage: PropTypes.func.isRequired,
  loadingExecution: PropTypes.bool.isRequired,
  setLoadingExecution: PropTypes.func.isRequired,
  setTradeResponse: PropTypes.func.isRequired,
};

export default TradePreviewModal;
