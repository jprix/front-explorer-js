import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import TransferDetailsModal from './TransferDetailsModal';
import TransferModal from './TransferModal';
import PortfolioHoldings from './PortfolioHoldings';

const ProviderDetails = ({
  existingAuthData,

  setExistingAuthData,
}) => {
  const [countdowns, setCountdowns] = useState({});
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [depositAuthData, setDepositAuthData] = useState({});
  const [openTransferDetailsModal, setOpenTransferDetailsModal] =
    useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState({});
  const updateCountdown = useCallback(() => {
    let newCountdowns = {};

    existingAuthData.forEach((data) => {
      if (data.accessToken.expiryTimestamp) {
        const timeLeft = Math.max(
          0,
          (data.accessToken.expiryTimestamp - new Date().getTime()) / 1000
        );
        newCountdowns[data.accessToken.brokerName] = timeLeft;
      } else {
        newCountdowns[data.accessToken.brokerName] = ' No expiry found';
      }
    });
    setCountdowns(newCountdowns);
  }, [existingAuthData]);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [updateCountdown]);

  useEffect(() => {
    existingAuthData.forEach((data) => {
      fetchPortfolioValue(data);
    });
    console.log('portfolio value', portfolioValue);
  }, []);

  const fetchPortfolioValue = async (data) => {
    try {
      const executePortfolioValue = await fetch(
        `/api/holdings/portfolio/value?brokerType=${data?.accessToken?.brokerType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: data.accessToken.accountTokens[0].accessToken,
          },
        }
      );

      if (!executePortfolioValue.ok) {
        throw new Error(
          `Failed to Link account: ${executePortfolioValue.statusText}`
        );
      }

      if (executePortfolioValue.ok) {
        const response = await executePortfolioValue.json();
        setPortfolioValue((prevValues) => ({
          ...prevValues,
          [data?.accessToken?.brokerName]: response.content,
        }));
      }
    } catch (error) {
      console.log('this was the error from Mesh', error);
    }
  };
  const handleTransferDetails = useCallback((data) => {
    console.log('getting transfer details', data);
    setSelectedData(data); // Set the selected data
    setOpenTransferDetailsModal(true);
  }, []);

  const handleDisconnect = async (authData) => {
    console.log('disconnecting', authData);
    const payload = {
      type: authData.accessToken.brokerType,
      authToken: authData.accessToken.accountTokens[0].accessToken,
    };

    try {
      const disconnect = await fetch('/api/disconnect', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!disconnect.ok) {
        throw new Error(
          `Failed to Disconnect account: ${disconnect.statusText}`
        );
      }

      // Remove disconnected authData from existingAuthData state and localStorage
      const updatedAuthData = existingAuthData.filter(
        (data) => data !== authData
      );
      setExistingAuthData(updatedAuthData);
      localStorage.setItem('authData', JSON.stringify(updatedAuthData[0]));
    } catch (error) {
      console.log('this was the error from Mesh', error);
    }
  };

  const handleReceive = async (data) => {
    console.log('receiving', data);
  };

  const handleDeposit = async (brokerAuth) => {
    console.log('depositing', brokerAuth);
    setDepositAuthData(brokerAuth);
    setOpenTransferModal(true);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Grid container spacing={3}>
      {existingAuthData?.map((data, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Connected Broker: {data?.accessToken?.brokerName}
              </Typography>
              <Card
                variant="outlined"
                style={{ marginTop: '10px', padding: '10px' }}
              >
                <Typography
                  variant="h8"
                  component="div"
                  style={{ marginBottom: '10px' }}
                >
                  Auth Data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Auth token expires in:
                  {typeof countdowns[data?.accessToken?.brokerName] === 'number'
                    ? `${Math.round(
                        countdowns[data?.accessToken?.brokerName] || 0
                      )} seconds`
                    : countdowns[data?.accessToken?.brokerName]}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Account Name:{' '}
                  {data?.accessToken?.accountTokens[0].account.accountName}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDisconnect(data)}
                  >
                    Disconnect
                  </Button>
                </div>
              </Card>
              <Card
                variant="outlined"
                style={{ marginTop: '10px', padding: '10px' }}
              >
                <Typography
                  variant="h7"
                  component="div"
                  style={{ marginBottom: '10px' }}
                >
                  Portfolio Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value:
                  <span style={{ marginLeft: '5px' }}>
                    {portfolioValue[
                      data?.accessToken?.brokerName
                    ]?.totalValue.toFixed(2)}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginTop: '5px' }}
                >
                  Total Performance:
                  <span style={{ marginLeft: '5px' }}>
                    {portfolioValue[
                      data?.accessToken?.brokerName
                    ]?.totalPerformance.toFixed(2)}
                  </span>
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '10px',
                  }}
                >
                  <PortfolioHoldings
                    brokerType={data?.accessToken?.brokerType}
                    userId={
                      data?.accessToken?.accountTokens[0]?.account?.accountId
                    }
                    existingAuthData={existingAuthData}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px', marginLeft: '10px' }}
                    size="small"
                    onClick={handleMenuClick}
                  >
                    Actions
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleReceive(data);
                        handleMenuClose();
                      }}
                    >
                      Receive / Deposit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeposit(data);
                        handleMenuClose();
                      }}
                    >
                      Send / Withdraw
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleTransferDetails(data);
                        handleMenuClose();
                      }}
                    >
                      Transfer History
                    </MenuItem>
                  </Menu>
                </div>
              </Card>

              {openTransferModal && (
                <TransferModal
                  open={openTransferModal}
                  onClose={() => setOpenTransferModal(false)}
                  brokerAuthData={depositAuthData}
                  existingAuthData={existingAuthData}
                />
              )}

              {openTransferDetailsModal && selectedData && (
                <TransferDetailsModal
                  open={openTransferDetailsModal}
                  onClose={() => {
                    setOpenTransferDetailsModal(false);
                    setSelectedData(null); // Reset the selected data when closing the modal
                  }}
                  brokerType={selectedData.accessToken.brokerType}
                  authToken={
                    selectedData.accessToken.accountTokens[0]?.accessToken
                  }
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(ProviderDetails);
