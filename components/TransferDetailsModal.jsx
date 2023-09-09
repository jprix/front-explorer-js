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
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { TransferContext } from '../context/transferContext';

const TransferDetailsModal = ({ open, onClose, brokerType, authToken }) => {
  const {
    transferDetails,
    getTransferDetails,
    loading,
    message,
    setLoadingTransfers,
  } = useContext(TransferContext);

  const [lastBrokerType, setLastBrokerType] = useState(brokerType);
  console.log('transferDetails', transferDetails);
  const lastBrokerTypeRef = useRef(null);

  useEffect(() => {
    const payload = {
      authToken: authToken,
      type: brokerType,
      count: 10,
    };

    const fetchTransfers = async () => {
      try {
        setLoadingTransfers(true);
        await getTransferDetails(payload);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLastBrokerType(brokerType);
        setLoadingTransfers(false);
      }
    };

    if (
      (!transferDetails || transferDetails.length === 0) &&
      lastBrokerTypeRef.current !== brokerType
    ) {
      fetchTransfers();
      lastBrokerTypeRef.current = brokerType;
    }
  }, [transferDetails, brokerType, getTransferDetails, setLoadingTransfers]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="transfer-details-dialog-title"
    >
      <DialogTitle id="transfer-details-dialog-title">
        Transaction Details:
      </DialogTitle>
      <DialogContent
        style={{
          width: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        }}
      >
        {loading ? (
          <CircularProgress style={{ margin: 0 }} />
        ) : transferDetails.length > 0 ? (
          <TableContainer
            component={Paper}
            style={{ maxWidth: '100%', height: '400px', overflow: 'auto' }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  <TableCell
                    style={{
                      position: 'sticky',
                      top: 0,
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                    sx={{ width: '20%' }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    style={{
                      position: 'sticky',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                    sx={{ width: '10%' }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    style={{
                      position: 'sticky',
                      top: 0,
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                    sx={{ width: '15%' }}
                  >
                    Symbol
                  </TableCell>
                  <TableCell
                    style={{
                      position: 'sticky',
                      top: 0,
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                    sx={{ width: 100 }}
                  >
                    Asset Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transferDetails.map((detail, index) => (
                  <TableRow
                    key={detail.id + '-' + index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor:
                        index % 2 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                    }}
                  >
                    <TableCell>{detail.transactionType}</TableCell>
                    <TableCell style={{ width: '50%' }}>
                      <Link href={`/request/${detail.id}`} passHref>
                        {detail.id}
                      </Link>
                    </TableCell>
                    <TableCell>{detail.name}</TableCell>
                    <TableCell>{detail.assetType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>{message}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
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
