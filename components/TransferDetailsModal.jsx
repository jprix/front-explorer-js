import React, { useState, useEffect, useContext, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { TransferContext } from '../context/transferContext';

const TransferDetailsModal = ({ open, onClose, brokerType, authToken }) => {
  const [openDetails, setOpenDetails] = useState(false);

  const {
    transferDetails,
    getTransferDetails,
    loading,
    message,
    setLoadingTransfers,
  } = useContext(TransferContext);

  const lastBrokerTypeRef = useRef('');
  console.log(
    'lastBrokerTypeRef',
    lastBrokerTypeRef,
    'broker type',
    brokerType
  );

  useEffect(() => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const currentTimestampMilliseconds = Date.now();
    const date30DaysBackMilliseconds =
      currentTimestampMilliseconds - 30 * millisecondsInADay;
    const date30DaysBackTimestamp = Math.floor(
      date30DaysBackMilliseconds / 1000
    );
    console.log(date30DaysBackTimestamp);
    const payload = {
      authToken: authToken,
      type: brokerType,
      count: 10,
      from: date30DaysBackTimestamp,
    };

    const fetchTransfers = async () => {
      console.log(
        'lastBrokerTypeRef.current',
        lastBrokerTypeRef.current,
        'brokerType',
        brokerType
      );
      try {
        if (
          !transferDetails ||
          transferDetails.length === 0 ||
          lastBrokerTypeRef.current !== brokerType
        ) {
          setLoadingTransfers(true);
          await getTransferDetails(payload);
          lastBrokerTypeRef.current = brokerType;
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoadingTransfers(false);
      }
    };

    fetchTransfers();
  }, [brokerType]);

  const handleOpen = () => {
    setOpenDetails(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
      maxWidth="md" // Ensure the dialog doesn't stretch beyond screen bounds
    >
      <DialogTitle id="transfer-details-dialog-title">
        {brokerType.charAt(0).toUpperCase() + brokerType.slice(1)} Transactions:
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : transferDetails.length > 0 ? (
          <TableContainer
            component={Paper}
            style={{ maxHeight: '400px', overflow: 'auto' }} // Adjusted the max height
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                  {/* Moved ID to the first position */}
                  <TableCell style={{ fontWeight: 'bold', width: '6%' }}>
                    ID
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Symbol</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    View Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transferDetails.map((detail, index) => (
                  <TableRow
                    key={detail.id + '-' + index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      style={{
                        maxWidth: '100px', // Adjust based on your needs
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {detail.id}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        detail.createdTimestamp * 1000
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{detail.transactionType}</TableCell>
                    <TableCell>{detail.symbol}</TableCell>
                    <TableCell>
                      <Tooltip title={detail.id} placement="top">
                        <Button onClick={handleOpen}>View Details</Button>
                      </Tooltip>
                      <Dialog
                        open={openDetails}
                        onClose={handleClose}
                        aria-labelledby="detail-dialog-title"
                      >
                        <DialogTitle id="detail-dialog-title">
                          Detail Information
                        </DialogTitle>
                        <DialogContent>
                          <Grid container spacing={2}>
                            {Object.entries(detail).map(([key, value]) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Typography variant="subtitle2">
                                  {key}:
                                </Typography>
                                <Typography variant="body2">
                                  {value.toString()}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          {/* Close button for the detailed view */}
                          <Button onClick={handleClose} color="primary">
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>{message}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TransferDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brokerType: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
};

export default TransferDetailsModal;
