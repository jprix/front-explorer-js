import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import ProviderDetails from '../components/ProviderDetails';
import NetworkDashboard from '../components/NetworksDashboard';
import MeshModal from '../components/MeshModal';
import Header from '../components/Header';

const HomePage = () => {
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [catalogLink, setCatalogLink] = useState('');
  const [connectAnotherAccount, setConnectAnotherAccount] = useState(false);

  const [openMeshModal, setOpenMeshModal] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
    if (existingAuthData.length <= 1) {
      console.log('allow another link');
      setConnectAnotherAccount(true);
    } else {
      setConnectAnotherAccount(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(existingAuthData));
  }, [existingAuthData]);

  const getCatalogLink = async () => {
    const link = await fetch(`/api/catalog?&EnableTransfers=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.iFrameUrl);
      setOpenMeshModal(true);
    }
  };

  const handleSuccess = (newAuthData) => {
    newAuthData.linkedAccount = false;

    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
    const expiryTimestamp =
      new Date().getTime() + newAuthData.accessToken.expiresInSeconds * 1000;
    newAuthData.accessToken.expiryTimestamp = expiryTimestamp;

    const maxExpiresInSeconds = Math.max(
      ...updatedAuthData.map((obj) => obj.accessToken.expiresInSeconds)
    );
    const inOneHour = new Date(
      new Date().getTime() + maxExpiresInSeconds * 1000
    );

    localStorage.setItem('authData', JSON.stringify(updatedAuthData));
  };

  const handleExit = (error) => {
    if (error) {
      console.log('Broker connection closed:', error);
    } else {
      console.log('Broker connection closed with no erros');
    }
  };

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
  };

  console.log('homepage');
  return (
    <div>
      <Header
        connectAnotherAccount={connectAnotherAccount}
        getCatalogLink={getCatalogLink}
        authData={existingAuthData}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '10px',
        }}
      >
        {existingAuthData === undefined || existingAuthData.length === 0 ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={getCatalogLink}
          >
            Connect to Mesh
          </Button>
        ) : null}
      </div>
      {openMeshModal && (
        <MeshModal
          open={openMeshModal}
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
        />
      )}

      {existingAuthData.length > 0 && (
        <>
          <ProviderDetails
            existingAuthData={existingAuthData}
            setExistingAuthData={setExistingAuthData}
            openMeshModal={openMeshModal}
            setOpenMeshModal={setOpenMeshModal}
            catalogLink={catalogLink}
          />
          <Grid item xs={12}>
            <NetworkDashboard />
          </Grid>
        </>
      )}
    </div>
  );
};

export default HomePage;
