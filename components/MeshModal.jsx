import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';

import { createFrontConnection } from '@front-finance/link';

const MeshModal = ({ open, onClose, link, onSuccess, onExit }) => {
  const [frontConnection, setFrontConnection] = useState(null);
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

  useEffect(() => {
    setFrontConnection(
      createFrontConnection({
        clientId: CLIENT_ID,
        onBrokerConnected: (authData) => {
          console.info('FRONT SUCCESS', authData);
          onSuccess(authData);
        },
        onExit: (error) => {
          if (error) {
            console.error(`[FRONT ERROR] ${error}`);
          }

          if (onExit) {
            onExit();
          }
        },
      })
    );
  }, []);

  useEffect(() => {
    if (open && frontConnection) {
      frontConnection.openPopup(link);
    }

    return () => {
      if (frontConnection) {
        frontConnection.closePopup();
      }
    };
  }, [frontConnection, open, link]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth></Dialog>
  );
};

MeshModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onExit: PropTypes.func,
};

export default MeshModal;
