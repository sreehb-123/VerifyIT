// app/index.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const IndexScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        // Check both auth token and role
        const [authToken, userRole] = await Promise.all([
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('userRole')
        ]);

        if (!userRole) {
          // Has auth token but no role - send to role selection
          router.replace('/Auth/RoleSelection');
          return;
        }
        if (!authToken) {
          // No auth token means user needs to login
          router.replace('/Auth/Login');
          return;
        }

        

        // Both auth token and role exist - navigate to appropriate home screen
        const normalizedRole = userRole.toLowerCase();
        switch (normalizedRole) {
          case 'admin':
            router.replace('/Home/Warden');
            break;
          case 'user':
           // router.replace('/Home/Student');
            break;
          case 'guest':
            router.replace('/Home/Security');
            break;
          default:
            await AsyncStorage.multiRemove(['authToken', 'userRole']);
            router.replace('/Auth/RoleSelection');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, clear storage and restart auth flow
        await AsyncStorage.multiRemove(['authToken', 'userRole']);
        router.replace('/Auth/RoleSelection');
      }
    };

    checkAuthAndRole();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

export default IndexScreen;