// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the App!</Text>
      <Button title="Continue to App" onPress={() => router.push('/Auth/RoleSelection')} />
    </View>
  );
};

export default Index;
