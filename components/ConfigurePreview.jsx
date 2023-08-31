import React, { useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, TextField, Select, Button, CircularProgress } from '@mui/material';

const ConfigurePreviewForm = ({brokerAuthData, depositAddress}) => {
  const [loading, setLoading] = useState(false);
  console.log('brokerAuthData', brokerAuthData, 'depositAddress', depositAddress)
  const [formValues, setFormValues] = useState({
    fromAuthToken: depositAddress?.symbol,
    fromType: '',
    robinhood: {
      toAuthToken: null,
      toType: null,
    },
    networkId: depositAddress?.networkId,
    symbol: null,
    toAddress: null,
    amount: null,
    amountInFiat: null,
    fiatCurrency: null,
  });

  const handleInputChange = (field, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitting formPreview');
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              required
              label="From Auth Token"
              value={formValues.fromAuthToken}
              onChange={(e) => handleInputChange('fromAuthToken', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              label="From Type"
              value={formValues.fromType}
              onChange={(e) => handleInputChange('fromType', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="To Auth Token"
              value={formValues.robinhood.toAuthToken || ''}
              onChange={(e) => handleInputChange('robinhood.toAuthToken', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="To Type"
              value={formValues.robinhood.toType || ''}
              onChange={(e) => handleInputChange('robinhood.toType', e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Network ID"
              value={formValues.networkId}
              onChange={(e) => handleInputChange('networkId', e.target.value)}
            />
          </FormControl>

          {/* Other fields can be added similarly */}
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigurePreviewForm;
