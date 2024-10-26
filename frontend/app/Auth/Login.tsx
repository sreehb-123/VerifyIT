// app/Auth/Login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { studentLogin, wardenLogin, securityLogin } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const handleLogin = async () => {
    try {
      let token: string;


      if (role === 'student') {
        token = await studentLogin(email, password);
        try {
          await AsyncStorage.setItem('userRole', role);
          // Redirect to the corresponding page based on the role
        } catch (error) {
          console.error('Error saving data', error);
        }
      } else if (role === 'warden') {
        token = await wardenLogin(email, password);
        try {
          await AsyncStorage.setItem('userRole', role);
          // Redirect to the corresponding page based on the role
        } catch (error) {
          console.error('Error saving data', error);
        }
      } else if (role === 'security') {
        token = await securityLogin(email, password);
        try {
          await AsyncStorage.setItem('userRole', role);
          // Redirect to the corresponding page based on the role
        } catch (error) {
          console.error('Error saving data', error);
        }
      } else {
        throw new Error('Invalid role');
      }


      await AsyncStorage.setItem('userToken', token);

      if (role === 'student') router.replace('/Home/Security');
      else if (role === 'warden') router.replace('/Home/Security');
      else if (role === 'security') router.replace('/Home/Security');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      {role === 'student' && (
        <Link href="/Auth/Signup?role=student" asChild>
        <TouchableOpacity>
          <Text >Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Link>
      )}
    </View>
  );
};

export default Login;