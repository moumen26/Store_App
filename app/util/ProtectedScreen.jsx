import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import { useAuthContext } from '../hooks/useAuthContext';

const ProtectedScreen = ({ children }) => {
  const { user } = useAuthContext();  
  const navigation = useNavigation(); 

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0, 
        routes: [{ name: 'SignIn/index' }], 
      });
    }
  }, [user, navigation]);

  if (!user) return null; 

  return <>{children}</>; 
};

export default ProtectedScreen;
