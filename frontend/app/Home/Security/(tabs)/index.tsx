//import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import {  StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { useCameraPermissions } from "expo-camera";

export default function TabOneScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);
  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />*/}
      <View style={{ gap: 20 }}>
        
        <Link href={"/Home/Security/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted}>
          <Entypo name="camera" size={24} style={[
                styles.icon,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]} color="#0E7AFE" />
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link>
        <Pressable onPress={requestPermission}>
          <Text style={[
            styles.buttonStyle,
            {opacity: isPermissionGranted ? 0:1}
          ]}>Request Permissions</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
  icon:{
    textAlign: "center",
  },
});
