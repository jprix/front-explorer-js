import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';

import { createFrontConnection } from '@front-finance/link';

const MeshModal = ({ open, onClose, link, onSuccess, onExit }) => {
  const [frontConnection, setFrontConnection] = useState(null);
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

  useEffect(() => {
    setFrontConnection(
      createFrontConnection({
        clientId: CLIENT_ID,
        onBrokerConnected: authData => {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
    </Dialog>
  );
};

export default MeshModal;
