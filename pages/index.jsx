import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MeshModal from '../components/MeshModal';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TransferDashboard from '../components/TransfersDashboard';
import NetworkDashboard from 'components/NetworksDashboard';


const HomePage = (props) => {
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [catalogLink, setCatalogLink] = useState('');
  
  const [existingAuthData, setExistingAuthData] = useState([]);
  const networks = fetch('/api/networks');
  console.log(networks)
  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
  }, []);


  const getCatalogLink = async () => {
    const link = await fetch('/api/catalog');
    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.iFrameUrl);
      console.log('index catalog link', catalogLink, response.content.iFrameUrl)
      setOpenMeshModal(true);
    }
  }

  const handleCloseMeshModal = () => {
    setOpenMeshModal(false);
  };

  const handleSuccess = (newAuthData) => {
    console.log('Broker connected successfully:', newAuthData);
    // Combine existing authData array with the new authData object
    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
  
    // Set the updated authData array to localStorage
    const maxExpiresInSeconds = Math.max(...updatedAuthData.map(obj => obj.accessToken.expiresInSeconds));
    const inOneHour = new Date(new Date().getTime() + maxExpiresInSeconds * 1000);
    
    localStorage.setItem('authData', JSON.stringify(updatedAuthData));

  };


  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
    // Handle the broker connection closed event
  };


  return (
    <div>
      <h1>Mesh Explorer</h1>
      {existingAuthData === undefined || existingAuthData.length === 0 ?
  <Button variant="contained" color="primary" onClick={getCatalogLink}>
    Connect to Mesh
  </Button> : 
  <Button variant="contained" color="primary" onClick={getCatalogLink}>
    Link Another Account
  </Button>
}

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
            Expires In: {data?.accessToken?.expiresInSeconds} seconds
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Account Name: {data?.accessToken?.accountTokens[0].account.accountName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fund: {data?.accessToken?.accountTokens[0]?.account?.fund}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cash: {data?.accessToken?.accountTokens[0]?.account?.cash}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" color="primary" size="small" style={{ marginRight: '10px' }}>
            Deposit
          </Button>
          <Button variant="contained" color="secondary" size="small">
            Disconnect
          </Button>
      </div>
        </CardContent>
      </Card>
    </Grid>
    
        ))}
         <Grid item xs={12}>
      {/* <TransferDashboard /> */}
      <NetworkDashboard  />
    </Grid>
        </Grid>
      )}
    </div>
  );
};

export default HomePage;


