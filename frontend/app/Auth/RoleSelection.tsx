// app/Auth/RoleSelection.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

const RoleSelection: React.FC = () => {
  const router = useRouter();

  const handleRoleSelect = (selectedRole: string) => {
    // Navigate to Login and pass role as a query parameter
    router.push({
      pathname: '/Auth/Login',
      params: { role: selectedRole },
    });
  };

  return (
    <View>
      <Button title="Student" onPress={() => handleRoleSelect('student')} />
      <Button title="Warden" onPress={() => handleRoleSelect('warden')} />
      <Button title="Security" onPress={() => handleRoleSelect('security')} />
    </View>
  );
};

export default RoleSelection;