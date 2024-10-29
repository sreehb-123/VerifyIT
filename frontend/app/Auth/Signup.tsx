import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { studentSignup, adminSignup } from '@/api';
import { Link, useLocalSearchParams } from 'expo-router';

const SignUp: React.FC<{ onSignUpSuccess: () => void }> = ({ onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');

  const { role } = useLocalSearchParams();

  const handleSignUp = async () => {
    console.log(role);
    try {
      if (role === 'student') {
        await studentSignup(email, password, rollNo);
      } else {
        Alert.alert('Error', 'Only Students can Sign Up');
      }
      onSignUpSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      {role === 'student' && (
        <TextInput 
          style={styles.input} 
          placeholder="Roll Number" 
          value={rollNo} 
          onChangeText={setRollNo} 
        />
      )}
      <Button title="Sign Up" onPress={handleSignUp} />
      <Link href="/Auth/Login?role=student" asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '90%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  linkText: {
    color: '#007bff',
    marginTop: 12,
    fontSize: 16,
  },
});

export default SignUp;