import React, { useState } from 'react';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { studentLogin, wardenLogin, securityLogin } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  inputBackground: string;
}

const Login: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme: ThemeColors = {
    background: colorScheme === 'light' ? '#1a1a1a' : '#f5f5f5',
    card: colorScheme === 'light' ? '#2d2d2d' : '#ffffff',
    text: colorScheme === 'light' ? '#ffffff' : '#000000',
    border: colorScheme === 'light' ? '#404040' : '#e0e0e0',
    primary: '#2196F3',
    inputBackground: colorScheme === 'light' ? '#404040' : '#ffffff',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const handleLogin = async () => {
    await AsyncStorage.clear();
  
    try {
      let token: string;
      let studentId: string | undefined;
  
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        Alert.alert('Invalid email');
        return;
      }
      if (!password) {
        Alert.alert('Password is required');
        return;
      }
  
      switch (role) {
        case 'student':
          [token, studentId] = await studentLogin(email, password);
          break;
        case 'warden':
          token = await wardenLogin(email, password);
          break;
        case 'security':
          token = await securityLogin(email, password);
          break;
        default:
          Alert.alert('Invalid role');
          return;
      }
  
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userToken', token);
      if (studentId) {
        await AsyncStorage.setItem('studentId', studentId);
      }
  
      // Redirect based on role
      if (role === 'student') router.replace('/Home/Student');
      else if (role === 'warden') router.replace('/Home/Warden');
      else if (role === 'security') router.replace('/Home/Security');
  
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };
  
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

    
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: theme.inputBackground }]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { backgroundColor: theme.inputBackground }]}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {role === 'student' && (
        <Link href="/Auth/demo2" asChild>
          <TouchableOpacity>
            <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    //flex: 1,
    maxWidth:400,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 5,
    padding: 10,
    color: '#000', // Adjust for text color
    minWidth: 250,
    maxWidth: 350
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 10,
    color: '#2196F3',
    textAlign: 'center',
  },
});

export default Login;
