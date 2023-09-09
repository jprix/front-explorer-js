import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import ProviderDetails from '../components/ProviderDetails';
import NetworkDashboard from '../components/NetworksDashboard';
import MeshModal from '../components/MeshModal';
import Header from '../components/Header';

const HomePage = () => {
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [catalogLink, setCatalogLink] = useState('');

  const [openMeshModal, setOpenMeshModal] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
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
      body: JSON.stringify({}),
    });
    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.iFrameUrl);
      setOpenMeshModal(true);
    }
  };

  const handleSuccess = (newAuthData) => {
    console.log('Broker connected successfully:');
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
      <Header />
      <h1>Mesh Explorer</h1>
      {existingAuthData === undefined || existingAuthData.length === 0 ? (
        <Button variant="contained" color="primary" onClick={getCatalogLink}>
          Connect to Mesh
        </Button>
      ) : existingAuthData.length <= 1 ? (
        <Button variant="contained" color="primary" onClick={getCatalogLink}>
          Link Another Account
        </Button>
      ) : null}
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
