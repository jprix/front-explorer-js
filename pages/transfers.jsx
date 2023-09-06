import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MeshModal from '../components/MeshModal';

const HomePage = () => {
  const [catalogLink, setCatalogLink] = useState('');
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [depositAuthData, setDepositAuthData] = useState({});
  const [existingAuthData, setExistingAuthData] = useState([]);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(existingAuthData));
  }, [existingAuthData]);

  const payload = {
    amountInFiat: 10, // amount to transfer
    toAddresses: [
      {
        symbol: 'USDC', // cryptocurrency to transfer
        address: '0x9Bf6207f8A3f4278E0C989527015deFe10e5D7c6', // address to transfer
        networkId: '7436e9d0-ba42-4d2b-b4c0-8e4e606b2c12', // network id from /api/v1/transfers/managed/networks request
      },
    ],
  };

  const getCatalogLink = async () => {
    const link = await fetch(
      `/api/catalog?Userid=1234567&CallbackUrl=https://eod2bzstw02upmc.m.pipedream.net&EnableTransfers=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.iFrameUrl);
      setOpenMeshModal(true);
    }
  };

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
  };

  const handleSuccess = (newAuthData) => {
    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
    localStorage.setItem('authData', JSON.stringify(updatedAuthData));
  };

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
  };

  const handleDisconnect = async (authData) => {
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

      const updatedAuthData = existingAuthData.filter(
        (data) => data !== authData
      );
      setExistingAuthData(updatedAuthData);
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
    } catch (error) {
      console.log('Error from Mesh:', error);
    }
  };

  const handleDeposit = (brokerAuth) => {
    setDepositAuthData(brokerAuth);
    setOpenTransferModal(true);
  };

  return (
    <div>
      <h1>Embedded Transfers</h1>
      {openMeshModal ? (
        <MeshModal
          open={openMeshModal}
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => getCatalogLink(true)}
        >
          Transfer
        </Button>
      )}
    </div>
  );
};

export default HomePage;
