import React, { useState, useEffect } from 'react';
import MeshModal from '../components/MeshModal';
import { useRouter } from 'next/router';
import Header from '../components/Header';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from '@mui/material';

const PayPage = () => {
  const [catalogLink, setCatalogLink] = useState('');
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"
  const { CLIENT_ID } = process.env;
  const router = useRouter();

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch(`/api/networks`);

        if (!response.ok) {
          // If the server responded with an error, throw it so that it can be caught in the catch block
          throw new Error(data.error || 'Something went wrong');
        }

        const data = await response.json();

        if (response && response.length === 0) {
          setErrorMessage('No records found.');
        } else {
          setNetworks(data.content.integrations);
        }
      } catch (error) {
        console.error('An error occurred:', error.message);
        setErrorMessage('Error fetching data.'); // Set the error message here
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setExistingAuthData(authData ? JSON.parse(authData) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(existingAuthData));
  }, [existingAuthData]);

  const payload = {
    amountInFiat: 10,
    toAddresses: [
      {
        symbol: 'USDC', // symbol to transfer
        address: '0xcC90c7c3E3Ad6e4E6bd8CF4fB10D09edC20a9506', // address to transfer
        networkId: 'e3c7fdd8-b1fc-4e51-85ae-bb276e075611', // polygon network id
      },
    ],
  };

  const getCatalogLink = async () => {
    try {
      const link = await fetch(
        `/api/catalog?Userid=${CLIENT_ID}&EnableTransfers=true`,
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
    } catch (error) {
      console.log('Error from Mesh:', error);
      setErrorMessage(`Something went wrong: ${error.message}`);
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

  const handleTransferFinished = (transferDetails) => {
    console.log('transferDetails', transferDetails);
    alert('Payment Success!');
    router.push('/');
  };

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
  };

  const [product, setProduct] = useState({
    name: 'Front NFT',
    price: '10 USDC',
    description: 'Exotic Front NFT',
    imageUrl:
      'https://mma.prnewswire.com/media/1334250/Front_Finance_Logo.jpg?p=facebook',
  });

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div>
      <Header />

      <h1>Pay</h1>

      {!loading && networks.length ? (
        <form>
          <Card>
            <CardHeader title="Product Details" />
            <div style={{ display: 'flex' }}>
              <CardMedia
                component="img"
                height="140"
                width="140"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <TextField
                  disabled
                  fullWidth
                  label="Product Name"
                  variant="outlined"
                  name="name"
                  value={product.name}
                  onChange={handleProductChange}
                />
                <TextField
                  disabled
                  fullWidth
                  label="Price"
                  variant="outlined"
                  name="price"
                  value={product.price}
                  onChange={handleProductChange}
                  style={{ marginTop: '16px' }}
                />
                <TextField
                  disabled
                  fullWidth
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                  style={{ marginTop: '16px' }}
                />
              </CardContent>
              {errorMessage ? <p>{errorMessage}</p> : null}
            </div>
          </Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '16px',
            }}
          >
            <Button
              onClick={getCatalogLink}
              variant="contained"
              color="primary"
            >
              Buy Now
            </Button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}

      {openMeshModal ? (
        <MeshModal
          open="true"
          onClose={handleCloseMeshModal}
          link={catalogLink}
          onSuccess={handleSuccess}
          onExit={handleExit}
          transferFinished={handleTransferFinished}
        />
      ) : null}
    </div>
  );
};

export default PayPage;
