import React, { useState, useEffect } from 'react';
import MeshModal from '../components/MeshModal';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { getCatalogLink } from 'utils/getCatalogLink';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const TransferPage = () => {
  const [catalogLink, setCatalogLink] = useState('');
  const [openMeshModal, setOpenMeshModal] = useState(false);
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"

  // State for select fields
  const [selectedType, setSelectedType] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState('');

  const { CLIENT_ID } = process.env;
  const router = useRouter();
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleTokenChange = (e) => setSelectedToken(e.target.value);
  const handleNetworkIdChange = (e) => setSelectedNetworkId(e.target.value);

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
          symbol: selectedToken, // symbol to transfer
          address: '0xcC90c7c3E3Ad6e4E6bd8CF4fB10D09edC20a9506', // address to transfer
          networkId: selectedNetworkId, // network id from /api/v1/transfers/managed/networks request
        },
      ],
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
    alert('Transfer Success!');
    router.push('/');
  };

  const handleExit = (error) => {
    console.log('Broker connection closed:', error);
  };

  return (
    <div>
      <Header getCatalogLink={getCatalogLink} authData={existingAuthData} />
      <h1>Embedded Deposits</h1>

      {!loading && networks.length ? (
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              {networks.map((integration) => (
                <MenuItem key={integration.type} value={integration.type}>
                  {integration.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedType && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Network</InputLabel>
              <Select
                value={selectedNetworkId}
                onChange={handleNetworkIdChange}
              >
                {networks
                  .find((integration) => integration.type === selectedType)
                  .networks.map((network) => (
                    <MenuItem key={network.id} value={network.id}>
                      {network.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {selectedNetworkId && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Token</InputLabel>
              <Select value={selectedToken} onChange={handleTokenChange}>
                {networks
                  .find((integration) => integration.type === selectedType)
                  .networks.find((network) => network.id === selectedNetworkId)
                  .supportedTokens.map((token) => (
                    <MenuItem key={token} value={token}>
                      {token}
                    </MenuItem>
                  ))}
              </Select>
              {errorMessage ? <p>{errorMessage}</p> : null}
            </FormControl>
          )}

          <Button
            onClick={() =>
              getCatalogLink(
                selectedType,
                setCatalogLink,
                setOpenMeshModal,
                setErrorMessage,
                payload
              )
            }
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
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

export default TransferPage;
