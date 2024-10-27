// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      headerBackVisible: false, // Prevent back navigation for auth flows
      gestureEnabled: false // Disable swipe back gesture
    }}>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Auth/Login" 
        options={{ 
          title: 'Login',
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="Auth/RoleSelection" 
        options={{ 
          title: 'Select Role',
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="Auth/Signup" 
        options={{ 
          title: 'Sign Up',
          headerBackVisible: true // Allow back to login
        }} 
      />
      <Stack.Screen 
        name="Home/Student" 
        options={{ title: 'Student' }} 
      />
      <Stack.Screen 
        name="Home/Warden" 
        options={{ title: 'Warden' }} 
      />
      <Stack.Screen 
        name="Home/Security" 
        options={{ title: 'Security' }} 
      />
    </Stack>
  );
}