import React, { useState, useEffect } from 'react';

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ChooseProvider = ({ getCatalogLink, setBrokerType, brokerType }) => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
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

  return (
    <div>
      <h1>Connect to your Provider</h1>

      {!loading && networks.length ? (
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={brokerType}
              onChange={(e) => setBrokerType(e.target.value)}
            >
              {networks.map((integration) => (
                <MenuItem key={integration.type} value={integration.type}>
                  {integration.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => getCatalogLink()}
          >
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
