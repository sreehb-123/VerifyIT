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
      } else if (role === 'warden') {
        token = await wardenLogin(email, password);
      } else if (role === 'security') {
        token = await securityLogin(email, password);
      } else {
        throw new Error('Invalid role');
      }


      await AsyncStorage.setItem('userToken', token);

      if (role === 'student') router.push('/Home/StudentHome');
      else if (role === 'warden') router.push('/Home/WardenHome');
      else if (role === 'security') router.push('/Home/SecurityHome');
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