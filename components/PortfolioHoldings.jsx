import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableCell,
  Dialog,
  DialogContent,
  CircularProgress,
  TableContainer,
  Paper,
  TableRow,
  TableHead,
  TableBody,
  Typography,
  Grid,
  DialogTitle,
  DialogActions,
} from '@mui/material';

const PortfolioHoldings = ({ brokerType, linkedAccount, existingAuthData }) => {
  console.log('portfolio holdings brokerType', brokerType);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0); // Add state variable to store portfolio value
  const [loadingPortfolioHoldings, setLoadingPortfolioHoldings] =
    useState(true);
  useEffect(() => {
    const fetchPortfolioHoldings = async () => {
      try {
        const response = await fetch(
          `/api/holdings/portfolio?brokerType=${brokerType}`
        );

        if (response.ok) {
          const data = await response.json();
          setPortfolioValue(data.content.cryptocurrenciesValue.toFixed(2)); // Set portfolio value
          setPortfolioHoldings(data.content.cryptocurrencyPositions);
        } else {
          console.error('Failed to fetch portfolio holdings');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setLoadingPortfolioHoldings(false); // Set loading to false once data has been fetched or an error has occurred
      }
    };

    fetchPortfolioHoldings();
  }, []);

  useEffect(() => {
    console.log('current link ', linkedAccount);
    if (!linkedAccount) {
      console.log('attempting to link your account');

      // Create a copy of the prop data
      let updatedData = [...existingAuthData];

      // Safety check and modify the copied data
      if (updatedData && updatedData.length > 0 && updatedData[0].accessToken) {
        updatedData[0].linkedAccount = true;
        localStorage.setItem('authData', JSON.stringify(updatedData));
      }
    }
  }, []);

  const handleOpen = () => {
    setOpenPortfolioModal(true);
  };

  const handleClose = () => {
    setOpenPortfolioModal(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        size="small"
        onClick={handleOpen}
      >
        Portfolio Details
      </Button>
      {openPortfolioModal && (
        <Dialog
          open={openPortfolioModal}
          onClose={handleClose}
          aria-labelledby="portfolio-details-dialog-title"
          maxWidth="md"
        >
          <DialogTitle id="portfolio-details-dialog-title">
            {linkedAccount
              ? `Portfolio Details: ${portfolioValue}`
              : 'Linking your account...'}
          </DialogTitle>

          {!linkedAccount ? (
            <DialogContent>
              <CircularProgress />
            </DialogContent>
          ) : (
            <DialogContent>
              {!loadingPortfolioHoldings ? (
                <CircularProgress />
              ) : portfolioHoldings?.length > 0 ? (
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: '400px', overflow: 'auto' }}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell style={{ fontWeight: 'bold', width: '6%' }}>
                          Symbol
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Market Value
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Percentage
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Last Price
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {portfolioHoldings.map((detail, index) => (
                        <TableRow
                          key={detail.symbol + '-' + index}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            style={{
                              maxWidth: '100px', // Adjust based on your needs
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {detail.symbol}
                          </TableCell>
                          <TableCell>${detail.marketValue}</TableCell>
                          <TableCell>{detail.portfolioPercentage}</TableCell>
                          <TableCell>${detail.lastPrice}</TableCell>
                          <TableCell>{detail.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p>No records found.</p>
                </div>
              )}
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default PortfolioHoldings;
