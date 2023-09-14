import React, { useState } from 'react';
import Link from 'next/link';
import { PropTypes } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { styled } from '@mui/system';

const Header = ({ setLinkAnother, connectAnotherAccount, authData }) => {
  const [dropdownValue, setDropdownValue] = useState('default');

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0', // Remove padding from the Toolbar
        }}
      >
        <Link href="/">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            Mesh Explorer
          </Typography>
        </Link>

        <FormControl>
          <Select
            labelId="pages-dropdown-label"
            id="pages-dropdown"
            style={{ width: '100px' }}
            value={dropdownValue}
            onChange={handleDropdownChange}
            renderValue={() =>
              dropdownValue === 'default' ? 'Demos' : 'Demos'
            }
          >
            <MenuItem value="default">Select a demo</MenuItem>

            <MenuItem value="pay-page">
              <Link href="/pay">Pay</Link>
            </MenuItem>
            <MenuItem value="transfers-page">
              <Link href="/transfers">Transfers</Link>
            </MenuItem>
            {connectAnotherAccount ? (
              <MenuItem>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setLinkAnother(true)}
                >
                  {!authData || authData.length === 0
                    ? 'Link Account'
                    : 'Link Another Account'}
                </Button>
              </MenuItem>
            ) : null}
            <MenuItem></MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
