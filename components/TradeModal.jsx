import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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
import SelectInput from '@mui/material/Select/SelectInput';

const TradeModal = ({ open, onClose, brokerType, authToken }) => {
  const [brokerDetails, setBrokerDetails] = useState({});
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [orderType, setOrderType] = useState('');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');

  useEffect(() => {
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
      dropdownOptions.push('market');
    }
    if (cryptocurrencyOrders?.limitType.supported) {
      dropdownOptions.push('limit');
    }
    if (cryptocurrencyOrders?.stopLossType.supported) {
      dropdownOptions.push('stopLoss');
    }
  }

  //   const handleOpen = () => {
  //     setOpenDetails(true);
  //   };

  //   const handleClose = () => {
  //     setOpenDetails(false);
  //   };

  //   const getNestedValue = (obj, path, defaultValue = '') => {
  //     return path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), obj);
  //   };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
      maxWidth="md" // Ensure the dialog doesn't stretch beyond screen bounds
    >
      <DialogTitle id="transfer-details-dialog-title">Trade Form </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
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
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </FormControl>
                  <Grid container justifyContent="flex-end" mt={2}></Grid>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <p>This is a message</p>
        </div>
      </DialogContent>
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
