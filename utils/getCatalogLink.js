import { getUserId } from '../utils/UserId';

export const getCatalogLink = async (
  brokerType,
  setCatalogLink = () => {},
  setOpenMeshModal = () => {},
  setErrorMessage = () => {},
  payload = null
) => {
  console.log('hit getCatalogLink', brokerType);
  const UserId = getUserId(brokerType);
  console.log('hit else', brokerType, 'UserId', UserId);

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
      `/api/catalog?UserId=${UserId}&BrokerType=${brokerType}`,
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
