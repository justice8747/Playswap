export const tokenExpred = (expiresAt) => {
  const currentTime = new Date();
  const expirationTime = new Date(expiresAt);

  // Check if the current time is greater than or equal to the expiration time
  return currentTime >= expirationTime;
};
