export const getUser = async () => {
  const localData = localStorage.appState && JSON.parse(localStorage?.appState);
  const mock = JSON.stringify(localData?.auth || { currentUser: null, users: [] })
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = mock;
  const data = await JSON.parse(response);
  return data;
};
