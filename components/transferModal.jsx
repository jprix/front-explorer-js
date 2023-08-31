import React, { useState } from 'react';
import { Card, CardContent, DialogContent, FormControl, MenuItem, TextField, Select, Grid, Typography, Box, DialogTitle, Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const Step1 = ({ onNext }) => {
    const [addressValid, setValidAddress] = useState(false);
    const [depositAddress, setDepositAddress] = useState({});
    const [addressType, setAddressType] = useState('ethAddress');
    const [type, setType] = useState('BTC');
  
    const getDepositAddress = async () => {
        const payload = {
            authToken: '111',
            type: 'BTC',
            symbol: 'BTC',
            adressType: 'DEPOSIT',
            chain: 'BTC',
            mfaCode: '123456',
        }


        try {
            const disconnect = await fetch('/api/transfers/deposits', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
      
            if (!disconnect.ok) {
              throw new Error(
                `Failed to Disconnect account: ${disconnect.statusText}`
              );
            }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('submitting form');
    };
  
    return (
      <div>
        <h2>Configure Transfer</h2>
        {addressValid ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="contained" color="primary" onClick={onNext}>
              Next
            </Button>
          </Box>
        ) : (
          <Card
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mt: 2,
              gap: 2,
              p: 2,
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>

              <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <Typography variant="h6">Type</Typography>

                <TextField
                  required
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder={type}
                />
              </FormControl>
                <FormControl fullWidth>
                  <Typography variant="h6">addressType</Typography>
                  <Select
                    labelId="addressType-label"
                    id="addressType"
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                  >
                    <MenuItem value="ethAddress">ETH</MenuItem>
                    <MenuItem value="btcAddress">BTC</MenuItem>
                    <MenuItem value="ltcAddress">LTC</MenuItem>
                    <MenuItem value="solAddress">SOL</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container justifyContent="flex-end" mt={2}>
    <Button variant="contained" color="primary" onClick={getDepositAddress}>
        Get Deposit Address
    </Button>
</Grid>




              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  


  
  
  const Step2 = ({ onNext, onBack }) => (
    <div>
      <h2>Preview Transfer</h2>
      {/* Your preview content here */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={onNext}>
          Next
        </Button>
      </Box>
    </div>
  );
  
  const Step3 = ({ onBack }) => (
    <div>
      <h2>Submit Transfer</h2>
      {/* Your final content here */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );

const TransferModal = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const theme = useTheme();
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
  
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" color="secondary">
            Transfer Form
            </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
        </IconButton>
        </DialogTitle>
      <DialogContent>
        {step === 1 && <Step1 onNext={nextStep} />}
        {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <Step3 onBack={prevStep} />}
      </DialogContent>
    </Dialog>
      );
    };
  
  export default TransferModal;
