import React, { useState, useCallback, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import TransactionDetailsModal from './TransactionDetailsModal';
import TransferDetailsModal from './TransferDetailsModal';
import TransferModal from './TransferModal';
import TradeModal from './TradeModal';
import PortfolioHoldings from './PortfolioHoldings';
import { disconnect, refresh } from 'utils/connections';

const ProviderDetails = ({ existingAuthData, setExistingAuthData }) => {
  const [countdowns, setCountdowns] = useState({});
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [depositAuthData, setDepositAuthData] = useState({});
  const [openTransactionDetailsModal, setOpenTransactionDetailsModal] =
    useState(false);
  const [openTransferDetailsModal, setOpenTransferDetailsModal] =
    useState(false);
  const [openTradeModal, setOpenTradeModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState({});
  const [currentDataItem, setCurrentDataItem] = useState(null);
  const [balance, setBalance] = useState({});

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

  const fetchBalance = async (data) => {
    try {
      const result = await fetch(
        `/api/balances?brokerType=${data.accessToken.brokerType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: data.accessToken.accountTokens[0].accessToken,
          },
        }
      );
      const balanceData = await result.json();
      setBalance((prevValues) => ({
        ...prevValues,
        [data?.accessToken?.brokerName]: balanceData,
      }));
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    existingAuthData.forEach((data) => {
      fetchPortfolioValue(data);
      fetchBalance(data);
    });
    console.log('portfolio value', portfolioValue);
  }, [existingAuthData]);

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
  const handleTransactionDetails = useCallback((data) => {
    setSelectedData(data);
    setOpenTransactionDetailsModal(true);
  }, []);

  const handleTrade = useCallback((data) => {
    setSelectedData(data);
    setOpenTradeModal(true);
  }, []);

  const handleTransferDetails = useCallback((data) => {
    console.log('getting Transfer details', data);
    setSelectedData(data); // Set the selected data
    setOpenTransferDetailsModal(true);
  }, []);

  const handleDisconnect = async (authData) => {
    const payload = {
      type: authData.accessToken.brokerType,
      authToken: authData.accessToken.accountTokens[0].accessToken,
    };

    try {
      const result = await disconnect(payload);
      if (result.status === 'ok') {
        const updatedAuthData = existingAuthData.filter(
          (data) => data !== authData
        );
        setExistingAuthData(updatedAuthData);
        localStorage.setItem('authData', JSON.stringify(updatedAuthData[0]));

        alert('Disconnected successfully');
      }
    } catch (error) {
      alert('Error while disconnecting', error);
    }
  };

  const handleRefresh = async (authData) => {
    console.log('refreshing', authData);
    const payload = {
      type: authData.accessToken.brokerType,
      refreshToken: authData.accessToken.accountTokens[0].refreshToken,
    };

    try {
      const result = await refresh(payload);
      if (result.status === 'ok') {
        const updatedAuthData = existingAuthData.map((data) => {
          if (data === authData) {
            const newExpiryTimestamp =
              new Date().getTime() + result.content.expiresInSeconds * 1000;

            return {
              ...data,
              expiresInSeconds: result.content.expiresInSeconds,
              accessToken: {
                ...data.accessToken,
                expiryTimestamp: newExpiryTimestamp,
                accountTokens: data.accessToken.accountTokens.map((token) => ({
                  ...token,
                  accessToken: result.content.accessToken,
                  refreshToken: result.content.refreshToken,
                })),
                expiresInSeconds: result.content.expiresInSeconds,
              },
            };
          }
          return data;
        });

        setExistingAuthData(updatedAuthData);
        localStorage.setItem('authData', JSON.stringify(updatedAuthData[0]));

        alert('refreshed token successfully');
      }
    } catch (error) {
      alert('Error while refreshing', error);
    }
  };

  const handleDeposit = async (brokerAuth) => {
    setDepositAuthData(brokerAuth);
    setOpenTransactionModal(true);
  };

  const handleMenuClick = (data, event) => {
    console.log('event', event, 'data', data);
    setCurrentDataItem(data);
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" component="div">
                  Connected Broker: {data?.accessToken?.brokerName}
                </Typography>
                <Avatar
                  alt="Broker Image"
                  src={`data:image/png;base64,${data?.accessToken?.brokerBrandInfo?.brokerLogo}`}
                />
              </div>
              <Card
                variant="outlined"
                style={{ marginTop: '10px', padding: '10px' }}
              >
                <Typography
                  variant="h6"
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
                  {data?.accessToken.accountTokens[0].refreshToken ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px', marginLeft: '10px' }}
                        size="small"
                        onClick={() => handleRefresh(data)}
                      >
                        Refresh Token
                      </Button>
                    </>
                  ) : null}
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '20px', marginLeft: '10px' }}
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
                  variant="h6"
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginTop: '5px' }}
                >
                  Buying Power:
                  <span style={{ marginLeft: '5px' }}>
                    {
                      balance[data?.accessToken?.brokerName]?.content
                        ?.balances[0].buyingPower
                    }
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
                    onClick={(event) => handleMenuClick(data, event)}
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
                        handleDeposit(currentDataItem);
                        handleMenuClose();
                      }}
                    >
                      Send / Withdraw
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleTransactionDetails(currentDataItem);
                        handleMenuClose();
                      }}
                    >
                      Transactions History
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleTransferDetails(currentDataItem);
                        handleMenuClose();
                      }}
                    >
                      Transfers History
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleTrade(currentDataItem);
                        handleMenuClose();
                      }}
                    >
                      Trade
                    </MenuItem>
                  </Menu>
                </div>
              </Card>

              {openTransactionModal && (
                <TransferModal
                  open={openTransactionModal}
                  onClose={() => setOpenTransactionModal(false)}
                  brokerAuthData={depositAuthData}
                  existingAuthData={existingAuthData}
                />
              )}

              {openTransactionDetailsModal && selectedData && (
                <TransactionDetailsModal
                  open={openTransactionDetailsModal}
                  onClose={() => {
                    setOpenTransactionDetailsModal(false);
                    setSelectedData(null); // Reset the selected data when closing the modal
                  }}
                  brokerType={selectedData.accessToken.brokerType}
                  authToken={
                    selectedData.accessToken.accountTokens[0]?.accessToken
                  }
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
              {openTradeModal && selectedData && (
                <TradeModal
                  open={openTradeModal}
                  buyingPower={
                    balance[data?.accessToken?.brokerName]?.content.balances[0]
                      ?.buyingPower
                  }
                  onClose={() => {
                    setOpenTradeModal(false);
                    setSelectedData(null);
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
