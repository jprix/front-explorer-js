import React, { useState } from 'react';
import Button from '@mui/material/Button';
import MeshModal from '../components/MeshModal';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TransferDashboard from '../components/TransfersDashboard';
import Cookies from 'js-cookie';
import cookie from 'cookie';


const HomePage = (props) => {
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [catalogLink, setCatalogLink] = useState('');
  
const [existingAuthData, setExistingAuthData] = useState(props.existingAuthData);


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
    // Combine existing authData array with the new authData object
    const updatedAuthData = [...existingAuthData, newAuthData];
    setExistingAuthData(updatedAuthData);
  
    // Set the updated authData array to the cookie
    const maxExpiresInSeconds = Math.max(...updatedAuthData.map(obj => obj.accessToken.expiresInSeconds));
    const inOneHour = new Date(new Date().getTime() + maxExpiresInSeconds * 1000);
  
    Cookies.set('authData', JSON.stringify(updatedAuthData), { expires: inOneHour });
  };
  
  

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
    // Handle the broker connection closed event
  };

  console.log('this is the authData', Cookies.get('authData'))

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
            <Typography variant="h5" component="div">
              Broker: {data?.accessToken?.brokerName}
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
              </CardContent>
            </Card>
          </Grid>
        ))}
         <Grid item xs={12}>
      <TransferDashboard />
    </Grid>
        </Grid>
      )}
    </div>
  );
};

export default HomePage;


export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie ?? '');
  const existingAuthData = cookies.authData ? JSON.parse(cookies.authData) : [];
  return { props: { existingAuthData } };
}
