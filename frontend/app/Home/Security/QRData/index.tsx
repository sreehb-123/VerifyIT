import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface ScannedData {
  name: string;
  email: string;
  [key: string]: any;
}

const QRDataScreen = () => {
  const params = useLocalSearchParams<{ scannedData: string }>();
  const router = useRouter();
  
  // Parse the data and ensure it's always an array
  const scannedData = params.scannedData ? 
    (Array.isArray(JSON.parse(params.scannedData)) ? 
      JSON.parse(params.scannedData) : 
      [JSON.parse(params.scannedData)]) as ScannedData[] : 
    null;

  const columnWidths = {
    name: 150,
    email: 200,
  };

  const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);

  const TableHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <View style={[styles.cell, { width: columnWidths.name }]}>
        <Text style={styles.headerText}>Name</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.email }]}>
        <Text style={styles.headerText}>Email</Text>
      </View>
    </View>
  );

  const TableRow = ({ data }: { data: ScannedData }) => (
    <View style={styles.row}>
      <View style={[styles.cell, { width: columnWidths.name }]}>
        <Text style={styles.cellText}>{data.name || '-'}</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.email }]}>
        <Text style={styles.cellText}>{data.email || '-'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned Data</Text>
      <Text style={styles.entryCount}>
        Number of Entries: <Text style={styles.NumberOfEntries}>{scannedData ? scannedData.length : 0}</Text>
      </Text>
      
      {scannedData ? (
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={[styles.table, { width: totalWidth }]}>
              <TableHeader />
              {scannedData.map((data, index) => (
                <TableRow key={index} data={data} />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data scanned.</Text>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Submit Record" onPress={() => router.back()} />{/* Navigate too main menu and send the data to database if clicked */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  entryCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  tableContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRow: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  cellText: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  NumberOfEntries:{
    fontWeight: 'bold',
  },
});

export default QRDataScreen;