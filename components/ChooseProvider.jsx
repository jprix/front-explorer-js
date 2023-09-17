import React, { useState, useEffect } from 'react';
import { getCatalogLink } from 'utils/getCatalogLink';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const ChooseProvider = ({
  setCatalogLink,
  brokerType = 'coinbase',
  setOpenMeshModal,
  setBrokerType,
}) => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [providerType, setProviderType] = useState(null);
  const [walletType, setWalletType] = useState('');
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch(`/api/networks`);

        if (!response.ok) {
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

  const handleProviderType = (value) => {
    setProviderType(value);
  };

  const handleExchangeType = (value) => {
    console.log('brokerType value', value);
    setBrokerType(value);
  };

  const handleClick = async () => {
    await getCatalogLink(
      brokerType,
      setCatalogLink,
      setOpenMeshModal,
      setErrorMessage,
      null,
      providerType,
      walletType
    );
  };

  return (
    <div>
      <h1>Connect to your Provider</h1>

      {!loading && networks.length ? (
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Box pb={2}>
              <InputLabel>Provider Type</InputLabel>
              <Select
                value={providerType}
                onChange={(e) => handleProviderType(e.target.value)}
                style={{ width: '200px' }}
              >
                <MenuItem value="CEX">CEX</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
              </Select>
            </Box>
          </FormControl>

          {providerType === 'CEX' ? (
            <FormControl fullWidth variant="outlined" margin="normal">
              <Box pb={2}>
                <InputLabel>Choose Exchange</InputLabel>
                <Select
                  value={brokerType}
                  onChange={(e) => handleExchangeType(e.target.value)}
                  style={{ width: '200px' }}
                >
                  {networks.map((integration) => (
                    <MenuItem key={integration.type} value={integration.type}>
                      {integration.type}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>
          ) : null}
          {providerType === 'Wallet' ? (
            <FormControl fullWidth variant="outlined" margin="normal">
              <Box pb={2}>
                <InputLabel>Choose Wallet Provider</InputLabel>
                <Select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  style={{ width: '200px' }}
                >
                  <MenuItem value="Coinbase">Coinbase</MenuItem>
                  <MenuItem value="MetaMask">MetaMask</MenuItem>
                </Select>
              </Box>
            </FormControl>
          ) : null}

          <Button variant="contained" color="secondary" onClick={handleClick}>
            Connect to Mesh
          </Button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ChooseProvider;
