import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, Tabs } from 'expo-router';
import { Pressable,Text } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const headerBackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const headerIconColor = colorScheme === 'dark' ? 'white' : 'black';
  function handleLogOut(){
    AsyncStorage.multiRemove(['userToken', 'userRole', 'studentId']);
    router.replace('/Auth/RoleSelection');
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen 
  name="index" 
  options={{ 
    title: 'Home',
    tabBarIcon: ({ color }) =><TabBarIcon name="home" color={color}/>,
    headerRight: () => ( 
      <Link href="/Home/Student/form" asChild>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
          {({ pressed }) => (
            <>
              <Text style={{ color: headerIconColor,}}>Request Permission</Text>
              <AntDesign 
                name="filetext1" size={24} color={headerIconColor} style={{ marginRight: 5 }}
              />
            </>
          )}
        </Pressable>
      </Link>
    ),
  }} 
/>
      <Tabs.Screen
        name="two"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
          headerRight: () => (
            <Pressable onPress={() => handleLogOut()}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
