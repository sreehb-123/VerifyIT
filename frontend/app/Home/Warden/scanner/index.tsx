import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert
} from "react-native";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const hasScanned = useRef(false);
  const appState = useRef(AppState.currentState);
  const [qrData, setQrData] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        hasScanned.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleQRScan = ({ data }: { data: string }) => {
    if (data && !hasScanned.current) {
      hasScanned.current = true;
      
      try {
        const newData = JSON.parse(data);
        setQrData(data);
        router.push({
          pathname: '../QRData',
          params: {
            scannedData: JSON.stringify(newData)
          },
        });
        
      } catch (error) {
        setTimeout(() => {
            Alert.alert("Error", "Invalid QR. Please try again.");
            hasScanned.current = false;
        }, 1000);
      }
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={hasScanned.current ? undefined : handleQRScan}

      />
    </SafeAreaView>
  );
}