import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import { studentSignup, adminSignup } from '@/api';
import { Link, useLocalSearchParams } from 'expo-router';

const SignUp: React.FC<{ onSignUpSuccess: () => void }> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');

  const {role} = useLocalSearchParams();
  
  const handleSignUp = async () => {
    console.log(role);
    try {
      if (role === 'student') {
        await studentSignup(email, password, rollNo);
      } else {
        //await adminSignup(email, password, role);
        Alert.alert('Error','Only Student can SignUp')
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
      <Link href="/Auth/Login" asChild>
        <TouchableOpacity>
          <Text>Already have an account? Log In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default SignUp;