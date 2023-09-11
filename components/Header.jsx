import React, { useState } from 'react';
import Link from 'next/link';
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

const Header = ({ getCatalogLink, connectAnotherAccount }) => {
  const [dropdownValue, setDropdownValue] = useState('');

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const WideInputLabel = styled(InputLabel)({
    width: '200px',
  });

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
            renderValue={() => (
              <Button
                aria-label="profile-menu"
                aria-controls="profile-menu"
                aria-haspopup="true"
                color="inherit"
              >
                Demos{' '}
              </Button>
            )}
          >
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
                  onClick={getCatalogLink}
                >
                  Link Another Account
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
