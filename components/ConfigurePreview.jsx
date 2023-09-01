import React, { useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, TextField, Typography, Select, Button, CircularProgress } from '@mui/material';

const ConfigurePreviewForm = ({brokerAuthData, depositAddress}) => {
  const [loading, setLoading] = useState(false);
  console.log('brokerAuthData', brokerAuthData, 'depositAddress', depositAddress)
  const [formValues, setFormValues] = useState({
    fromAuthToken: brokerAuthData?.address,
    fromType: brokerAuthData?.accessToken?.brokerType,
    fromNetworkId: brokerAuthData?.address,
    toAuthToken: depositAddress?.address,
    toType: "robinhood",
    toAddresses:{
        networkId: depositAddress?.networkId,
        symbol: 'eth',
        address: depositAddress?.address,
    symbol: 'eth',
    amount: 0.0,
    amountInFiat: 1.0,
    
    }
    
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
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Sending From: {brokerAuthData?.accessToken?.brokerType}</Typography>
          <TextField
            required
            label="From Auth Token"
            value={formValues.fromAuthToken}
            onChange={(e) => handleInputChange('fromAuthToken', e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            required
            label="From Type"
            value={formValues.fromType}
            onChange={(e) => handleInputChange('fromType', e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="To Auth Token"
            value={formValues?.toAuthToken || ''}
            onChange={(e) => handleInputChange('toAuthToken', e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="To Type"
            value={formValues?.toType || ''}
            onChange={(e) => handleInputChange('toType', e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Network ID"
            value={formValues.networkId}
            onChange={(e) => handleInputChange('networkId', e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Originating Address"
            value={formValues?.networkAddress || ''}
            onChange={(e) => handleInputChange('networkAddress', e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant="h5">Sending To: {formValues?.toType} </Typography>
          {/* Other fields can be added similarly */}
        </FormControl>
       
  
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </CardContent>
  </Card>
  

  );
};

export default ConfigurePreviewForm;
