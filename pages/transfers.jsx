import React, { useState, useEffect } from 'react';
import MeshModal from '../components/MeshModal';
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
  const [depositAuthData, setDepositAuthData] = useState({});
  const [existingAuthData, setExistingAuthData] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState(''); // Use to store messages like "No records found" or "Error fetching data"

  // State for select fields
  const [selectedType, setSelectedType] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState('');

  // Handle changes for each select field
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
          setMessage('No records found.');
        } else {
          setNetworks(data.content.integrations);
        }
      } catch (error) {
        console.error('An error occurred:', error.message);
        setMessage('Error fetching data.'); // Set the error message here
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

  //**** select menu ****

  const payload = {
    amountInFiat: 10, // amount to transfer
    toAddresses: [
      {
        symbol: selectedToken, // symbol to transfer
        address: '0xcC90c7c3E3Ad6e4E6bd8CF4fB10D09edC20a9506', // address to transfer
        networkId: selectedNetworkId, // network id from /api/v1/transfers/managed/networks request
      },
    ],
  };

  const getCatalogLink = async () => {
    const link = await fetch(
      `/api/catalog?Userid=1234567&BrokerType=${selectedType}&CallbackUrl=https://eod2bzstw02upmc.m.pipedream.net&EnableTransfers=true`,
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

  const handleDeposit = (brokerAuth) => {
    setDepositAuthData(brokerAuth);
    setOpenTransferModal(true);
  };

  return (
    <div>
      <h1>Embedded Deposits</h1>

      {/* Select Menu */}
      {!loading && networks.length ? (
        <form>
          {/* Type Dropdown */}
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

          {/* Network Dropdown - Only display if a type is selected */}
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

          {/* Token Dropdown - Only display if a network is selected */}
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
            </FormControl>
          )}

          <Button onClick={getCatalogLink} variant="contained" color="primary">
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
        />
      ) : null}
    </div>
  );
};

export default TransferPage;
