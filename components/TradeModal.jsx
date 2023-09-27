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
import { TransferContext } from '../context/transferContext';

const TradeModal = ({ open, onClose, brokerType, authToken }) => {
  //   const [openDetails, setOpenDetails] = useState(false);
  const [symbol, setSymbol] = useState('ETH');
  const [loading, setLoading] = useState(false);

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
                    <Typography variant="h6">Destination</Typography>
                    <TextField
                      required
                      id="destination"
                      value="placeholder text"
                      disabled
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Typography variant="h6">Symbol</Typography>
                    <Select
                      required
                      labelId="symbol-label"
                      id="symbol"
                      value={symbol}
                      label="Symbol"
                      placeholder="eth"
                      onChange={(e) => setSymbol(e.target.value)}
                    >
                      <MenuItem value="ETH">ETH</MenuItem>
                      <MenuItem value="BTC">BTC</MenuItem>
                      <MenuItem value="LTC">LTC</MenuItem>
                      <MenuItem value="SOL">SOL</MenuItem>
                      <MenuItem value="DOGE">DOGE</MenuItem>
                    </Select>
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
