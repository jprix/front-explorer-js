import React, { useState, useEffect } from 'react';
import MeshModal from '../components/MeshModal';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ChooseProvider from 'components/ChooseProvider';
import { getCatalogLink } from 'utils/getCatalogLink';
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
  const [brokerType, setBrokerType] = useState('');
  const router = useRouter();

  const DESTINATION_ADDRESS = process.env.NEXT_PUBLIC_DESTINATION_ADDRESS;

  console.log('destination address', DESTINATION_ADDRESS);
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
    transferOptions: {
      toAddresses: [
        {
          symbol: 'USDC',
          address: DESTINATION_ADDRESS, // address to transfer
          networkId: 'e3c7fdd8-b1fc-4e51-85ae-bb276e075611', // polygon network id
        },
        {
          symbol: 'SOL',
          address: 'DVifyLEUVxCAUTdi8rPHX9fmi1tCwv7hciut4BErskZ8', // address to transfer
          networkId: '0291810a-5947-424d-9a59-e88bb33e999d', // polygon network id
        },
      ],
      amountInFiat: 10,
    },
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

  const handleClick = async () => {
    await getCatalogLink(
      brokerType,
      setCatalogLink,
      setOpenMeshModal,
      setErrorMessage,
      payload
    );
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
      {!brokerType ? (
        <ChooseProvider
          variant="contained"
          color="secondary"
          brokerType={brokerType}
          //getCatalogLink={getCatalogLink}
          setBrokerType={setBrokerType}
        />
      ) : !loading && networks.length ? (
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
            <Button onClick={handleClick} variant="contained" color="primary">
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
