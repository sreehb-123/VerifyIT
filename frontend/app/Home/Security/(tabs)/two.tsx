import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface ScannedData {
  name: string;
  email: string;
  contactNumber: string;
  inTime: string;
  outTime: string;
  [key: string]: any;
}

const TabTwo = () => {
  const params = useLocalSearchParams<{ scannedData: string }>();
  const router = useRouter();
  const scannedData = params.scannedData ? JSON.parse(params.scannedData as string) as ScannedData : null;

  const columnWidths = {
    name: 150,
    email: 200,
    contactNumber: 120,
    inTime: 100,
    outTime: 100,
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
      <View style={[styles.cell, { width: columnWidths.contactNumber }]}>
        <Text style={styles.headerText}>Contact</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.inTime }]}>
        <Text style={styles.headerText}>In Time</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.outTime }]}>
        <Text style={styles.headerText}>Out Time</Text>
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
      <View style={[styles.cell, { width: columnWidths.contactNumber }]}>
        <Text style={styles.cellText}>{data.contactNumber || '-'}</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.inTime }]}>
        <Text style={styles.cellText}>{data.inTime || '-'}</Text>
      </View>
      <View style={[styles.cell, { width: columnWidths.outTime }]}>
        <Text style={styles.cellText}>{data.outTime || '-'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Activity</Text>
      {scannedData ? (
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={[styles.table, { width: totalWidth }]}>
              <TableHeader />
              <TableRow data={scannedData} />
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data to Show</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => router.back()} />
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
    marginBottom: 5,
    color: '#333',
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
});

export default TabTwo;