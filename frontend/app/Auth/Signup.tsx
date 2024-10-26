import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { studentSignup, adminSignup } from '@/api';

const SignUp: React.FC<{ role: string; onSignUpSuccess: () => void }> = ({ role, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');

  const handleSignUp = async () => {
    try {
      if (role === 'student') {
        await studentSignup(email, password, rollNo);
      } else {
        await adminSignup(email, password, role);
      }
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      {role === 'student' && (
        <TextInput 
          placeholder="Roll Number" 
          value={rollNo} 
          onChangeText={setRollNo} 
        />
      )}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUp;