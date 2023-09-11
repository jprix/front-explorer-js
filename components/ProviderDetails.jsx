import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
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

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [updateCountdown]);

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
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
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

  console.log('does it re render?');
  return (
    <Grid container spacing={3}>
      {existingAuthData?.map((data, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Connected Broker: {data?.accessToken?.brokerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broker Type: {data?.accessToken?.brokerType}
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
              <Typography variant="body2" color="text.secondary">
                Fund: {data?.accessToken?.accountTokens[0]?.account?.fund}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cash: {data?.accessToken?.accountTokens[0]?.account?.cash}
              </Typography>
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

              <PortfolioHoldings
                userId={data?.accessToken?.accountTokens[0]?.account?.accountId}
              />
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
                  style={{ marginRight: '10px' }}
                  onClick={() => handleDeposit(data)}
                  disabled={existingAuthData.length < 2}
                >
                  Send / Withdraw
                </Button>
                <Button
                  variant="contained"
                  color="tertiary"
                  size="small"
                  style={{ marginRight: '10px', color: 'white' }}
                  onClick={() => handleReceive(data)}
                  disabled={existingAuthData.length < 2}
                >
                  Receive / Deposit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '10px', color: 'white' }}
                  size="small"
                  onClick={() => handleTransferDetails(data)}
                >
                  Transfer History
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleDisconnect(data)}
                >
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(ProviderDetails);
