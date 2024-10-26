import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function QRData() {
  const router = useRouter();
  
  // Access the scannedData from params
  //const scannedData = router.params.scannedData;
    const scannedData = "jhwvex wjehbx";
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned Data:</Text>
      <Text style={styles.data}>{JSON.stringify(scannedData, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  data: {
    fontSize: 16,
    textAlign: 'center',
  },
});
