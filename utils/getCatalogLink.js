import { getUserId } from '../utils/UserId';

export const getCatalogLink = async (
  selectedType = null,
  setCatalogLink = () => {},
  setOpenMeshModal = () => {},
  setErrorMessage = () => {},
  payload = null,
  providerType
) => {
  // if (!selectedType) {
  //   console.warn('selectedType was not provided to getCatalogLink');
  //   return;
  // }
  console.log('providerType', providerType);

  let effectiveType = selectedType;
  if (providerType === 'Wallet') {
    effectiveType = '';
    console.log('updated effectiveType', effectiveType);
  }

  console.log('selectedType', selectedType);
  const UserId = getUserId(selectedType);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (payload) {
    fetchOptions.body = JSON.stringify(payload);
  }

  try {
    const link = await fetch(
      `/api/catalog?Userid=${UserId}&BrokerType=${effectiveType}`,
      fetchOptions
    );

    const response = await link.json();
    if (response) {
      setCatalogLink(response.content.linkToken);
      setOpenMeshModal(true);
    }
  } catch (error) {
    console.log('Error from Mesh:', error);
    setErrorMessage(`Something went wrong: ${error.message}`);
  }
};
