import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Card,
  CardContent,
  FormControl,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

const TradePreviewModal = ({
  open,
  onClose,
  brokerType,
  authToken,
  symbol,
  side,
  orderType,
  amount,
  timeInForce,
  paymentSymbol,
  setTradeStage,
  tradeStage,
  loadingPreviewDetails,
  setLoadingPreviewDetails,
}) => {
  const [loadingExecution, setLoadingExecution] = useState(false);

  const executeTrade = async () => {
    console.log('executeTrade');
    setLoadingExecution(true);
    try {
      const executeTrade = await fetch(
        `/api/transactions/execute?brokerType=${brokerType}&side=${side}&paymentSymbol=${paymentSymbol}&symbol=${symbol}&orderType=${orderType}&timeInForce=${timeInForce}&amount=${amount}`,
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

        throw new Error(
          `Failed to getTradePreview: ${executeTrade.statusText}`
        );
      }
      const response = await executeTrade.json();
      console.log('response', response);
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
            <CardContent sx={{ flexGrow: 1 }}>
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
                    helperText="Symbol to use for payment, defaults to USD."
                  />
                </FormControl>
                <Grid container justifyContent="flex-end" mt={2}>
                  <Button
                    onClick={executeTrade}
                    variant="contained"
                    color="primary"
                  >
                    Submit {symbol} {side}
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
};

export default TradePreviewModal;