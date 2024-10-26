// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="Auth/RoleSelection" options={{ title: 'Select Role' }} />
      <Stack.Screen name="Auth/Login" options={{ title: 'Login' }} />
      <Stack.Screen name="Auth/Signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="Home/StudentHome" options={{ title: 'Student Home' }} />
      <Stack.Screen name="Home/WardenHome" options={{ title: 'Warden Home' }} />
      <Stack.Screen name="Home/SecurityHome" options={{ title: 'Security Home' }} />
    </Stack>
  );
}