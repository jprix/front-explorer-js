import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MeshModal from '../components/MeshModal';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const HomePage = () => {
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [catalogLink, setCatalogLink] = useState('');
  const [authData, setAuthData] = useState([]);

  const getCatalogLink = async () => {
    const link = await fetch('/api/catalog');
    const response = await link.json();
    console.log('this is the response from the api', response);
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
    setAuthData([...authData, newAuthData]);
  };
  

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
    // Handle the broker connection closed event
  };

  console.log('this is the authData', authData)

  return (
    <div>
      <h1>Mesh Explorer</h1>
      {authData.length === 0 ?
      <Button variant="contained" color="primary" onClick={getCatalogLink}>
        Connect to Mesh
      </Button> : <Button variant="contained" color="primary" onClick={getCatalogLink}>
        Link Another Account </Button>
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

{authData.length > 0 && (
  <Grid container spacing={3}>
    {authData.map((data, index) => (
      <Grid item xs={12} key={index}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Broker: {data.accessToken.brokerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Broker Type: {data.accessToken.brokerType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires In: {data.accessToken.expiresInSeconds} seconds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Name: {data.accessToken.accountTokens[0].account.accountName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fund: {data.accessToken.accountTokens[0].account.fund}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cash: {data.accessToken.accountTokens[0].account.cash}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}
    </div>
  );
};

export default HomePage;
