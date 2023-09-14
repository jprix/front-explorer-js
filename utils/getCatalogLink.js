import { getUserId } from '../utils/UserId';
export const getCatalogLink = async (
  selectedType,
  setCatalogLink,
  setOpenMeshModal,
  setErrorMessage,
  payload
) => {
  const UserId = getUserId(selectedType);
  try {
    const link = await fetch(
      `/api/catalog?Userid=${UserId}&BrokerType=${selectedType}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
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
