import { useState, useEffect } from 'react';

const USER_TOKEN_KEY = 'cs2market_user_token';

// Simple UUID generator (no external dependency needed)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useUserToken = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Try to get existing token from localStorage
    let token = localStorage.getItem(USER_TOKEN_KEY);
    
    // If no token exists, generate a new one
    if (!token) {
      token = generateUUID();
      localStorage.setItem(USER_TOKEN_KEY, token);
    }
    
    setUserToken(token);
  }, []);

  return userToken;
};

export default useUserToken;
