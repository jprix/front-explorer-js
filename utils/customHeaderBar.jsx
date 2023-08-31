import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomHeaderBar = ({ title, onClose }) => {
  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {title}
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomHeaderBar;
