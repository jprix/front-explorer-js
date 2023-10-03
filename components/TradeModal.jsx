import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TradePreviewModal from './TradePreview';
import {
  Card,
  CardContent,
  FormControl,
  Typography,
  Select,
  MenuItem,
  Grid,
  TextField,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

const TradeModal = ({ open, onClose, brokerType, authToken }) => {
  const [brokerDetails, setBrokerDetails] = useState({});
  const [symbol, setSymbol] = useState('');
  const [loadingPreviewDetails, setLoadingPreviewDetails] = useState(false);
  const [assets, setAssets] = useState([]);
  const [orderType, setOrderType] = useState('marketType');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState(10);
  const [loadingBrokerDetails, setLoadingBrokerDetails] = useState(false);
  const [timeInForce, setTimeInForce] = useState('GTC');
  const [paymentSymbol, setPaymentSumbol] = useState('USD');
  const [tradeStage, setTradeStage] = useState(1);
  useEffect(() => {
    setLoadingBrokerDetails(true);
    const fetchBrokerDetails = async () => {
      try {
        const response = await fetch(
          `/api/transactions/broker/support?brokerType=${brokerType}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authToken: authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        setBrokerDetails(data);
        setAssets(data.cryptocurrencyOrders?.supportedCryptocurrencySymbols);
        setLoadingBrokerDetails(false);
      } catch (error) {
        console.error(error); // It's better to use console.error for logging errors
      }
    };

    fetchBrokerDetails();
  }, [brokerType]); // don't forget to include your dependencies

  let dropdownOptions = [];

  if (brokerDetails) {
    const { cryptocurrencyOrders } = brokerDetails;
    if (cryptocurrencyOrders?.marketType.supported) {
      dropdownOptions.push('marketType');
    }
    if (cryptocurrencyOrders?.limitType.supported) {
      dropdownOptions.push('limitType');
    }
    if (cryptocurrencyOrders?.stopLossType.supported) {
      dropdownOptions.push('stopLossType');
    }
  }
  const getSupportedTimeInForceList = () => {
    if (
      brokerDetails.cryptocurrencyOrders &&
      brokerDetails.cryptocurrencyOrders[orderType]
    ) {
      return brokerDetails.cryptocurrencyOrders[orderType]
        .supportedTimeInForceList;
    }
    return null;
  };

  const supportedTimeInForceList = getSupportedTimeInForceList();

  const handleTrade = async () => {
    console.log('handleTrade');
    setLoadingPreviewDetails(true);
    try {
      const getTradePreview = await fetch(
        `/api/transactions/preview?brokerType=${brokerType}&side=${side}&paymentSymbol=${paymentSymbol}&symbol=${symbol}&orderType=${orderType}&timeInForce=${timeInForce}&amount=${amount}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authToken: authToken,
          },
          method: 'POST',
        }
      );
      if (!getTradePreview.ok) {
        setLoadingPreviewDetails(false);

        throw new Error(
          `Failed to getTradePreview: ${getTradePreview.statusText}`
        );
      }
      const response = await getTradePreview.json();
      console.log('response', response);
      setTradeStage(2);
      setLoadingPreviewDetails(false);
    } catch (error) {
      console.log('this was the error from Mesh', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
      maxWidth="md" // Ensure the dialog doesn't stretch beyond screen bounds
    >
      {tradeStage === 1 ? (
        <>
          <DialogTitle id="transfer-details-dialog-title">
            Trade Form{' '}
          </DialogTitle>

          <DialogContent>
            {loadingBrokerDetails || loadingPreviewDetails ? (
              <>
                <p>Loading...</p>
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
                        <Select
                          required
                          labelId="orderType-label"
                          id="orderType"
                          value={orderType}
                          label="Select Order Type"
                          onChange={(e) => setOrderType(e.target.value)}
                        >
                          {dropdownOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Select Symbol</Typography>
                        <Select
                          required
                          labelId="symbol-label"
                          id="symbol"
                          value={symbol}
                          label="Select Symbol Type"
                          onChange={(e) => setSymbol(e.target.value)}
                        >
                          {assets.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Select Order Side</Typography>
                        <Select
                          required
                          labelId="side-label"
                          id="side"
                          value={side}
                          label="Select Side Type"
                          onChange={(e) => setSide(e.target.value)}
                        >
                          <MenuItem value="buy">Buy</MenuItem>
                          <MenuItem value="sell">Sell</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Amount</Typography>
                        <TextField
                          required
                          id="amount"
                          value={amount}
                          label="Amount"
                          helperText="Amount of purchase."
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Time In force</Typography>
                        <Select
                          required
                          labelId="symbol-label"
                          id="symbol"
                          value={timeInForce}
                          label="Select Symbol Type"
                          onChange={(e) => setTimeInForce(e.target.value)}
                        >
                          {supportedTimeInForceList?.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant="h6">Payment Symbol</Typography>
                        <TextField
                          required
                          id="payment-symbol"
                          value={paymentSymbol}
                          helperText="Symbol to use for payment, defaults to USD."
                          onChange={(e) => setPaymentSumbol(e.target.value)}
                        />
                      </FormControl>
                      <Grid container justifyContent="flex-end" mt={2}>
                        <Button
                          onClick={handleTrade}
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
          </DialogContent>
        </>
      ) : null}

      {tradeStage === 2 ? (
        <TradePreviewModal
          symbol={symbol}
          side={side}
          orderType={orderType}
          amount={amount}
          timeInForce={timeInForce}
          setTradeStage={setTradeStage}
          tradeStage={tradeStage}
          paymentSymbol={paymentSymbol}
          loadingPreviewDetails={loadingPreviewDetails}
          setLoadingPreviewDetails={setLoadingPreviewDetails}
        />
      ) : null}

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TradeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brokerType: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
};

export default TradeModal;
