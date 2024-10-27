import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, useColorScheme, ScrollView, Pressable} from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { Link } from 'expo-router';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  inputBackground: string;
}

const Login = () => {
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

  const handleSubmit = () => {
    // Validate email
    if (email.length === 0) {
      Alert.alert('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid email');
    }

    // Validate password
    if (password.length === 0) {
      Alert.alert('Password is required');
    }
    
    onSubmit();
  };

  const onSubmit = () => {
    // Successful submission logic here
    console.log('Form submitted successfully');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Login</Text> 
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <View>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Enter email"
              placeholderTextColor={`${theme.text}80`}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <View>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Enter password"
              placeholderTextColor={`${theme.text}80`}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          
          <Link href="../demo2" asChild>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
              {({ pressed }) => (
                <Text style={{ color: theme.text }}>
                  Don't have an account? SignUp
                </Text>
              )}
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    padding: 20,
    height: 700,
    maxWidth: Platform.OS === 'web' ? 450 : '100%',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: Platform.select({ ios: '600', android: 'bold', web: '600' }),
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;