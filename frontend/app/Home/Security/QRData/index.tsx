import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface ScannedData {
  requestId: string;
  rollNo: string[];
  noOfStudents: number;
  entryDate: string;
  [key: string]: any;
  records: string;
}

const API_BASE_URL = 'http://192.168.6.32:5000'; //replace this with your actual Laptop's IP Address

const QRDataScreen = () => {
  const params = useLocalSearchParams<{ scannedData: string }>();
  const router = useRouter();

  const scannedData = params.scannedData ? 
    (Array.isArray(JSON.parse(params.scannedData)) ?
      JSON.parse(params.scannedData) :
      [JSON.parse(params.scannedData)]) as ScannedData[] :
    null;

  const isDateExpired = (dateStr: string): boolean => {
    const entryDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entryDate < today;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAccept = async (id: string, records: string) => {
    console.log(id);
    try {
      const token = await AsyncStorage.getItem('userToken');

      console.log(token);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.patch(`${API_BASE_URL}/api/leaves/requests/exit`, {
        id,
        records: records === 'inactive' ? 'active' : records === 'active' ? 'done' : 'done',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      Alert.alert('Success', 'Request activated successfully');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to accept request';
      Alert.alert('Error', errorMessage);
    }
  };

  const DataCard = ({ data }: { data: ScannedData }) => {
    const isExpired = isDateExpired(data.entryDate);
    
    return (
      <View style={[
        styles.card,
        isExpired ? styles.expiredCard : styles.validCard
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.studentsCount}>
              {data.noOfStudents}
              <Text style={styles.studentsLabel}> Students</Text>
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            isExpired ? styles.expiredBadge : styles.validBadge
          ]}>
            <Text style={styles.statusText}>
              {isExpired ? 'EXPIRED' : 'VALID'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.label}>Roll Numbers:</Text>
          <View style={styles.rollNumbersContainer}>
            {data.rollNo.map((roll, index) => (
              <View key={index} style={styles.rollNumberBadge}>
                <Text style={styles.rollNumberText}>{roll}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Entry Date: {formatDate(data.entryDate)}
          </Text>
        </View>
      </View>
    );
  };

  const handleSubmit = () => {
    if (!scannedData) {
      Alert.alert('Error', 'No data to submit');
      return;
    }

    const hasExpiredData = scannedData.some(data => isDateExpired(data.entryDate));
    if (hasExpiredData) {
      Alert.alert(
        'Warning',
        'Some entries have expired dates. Do you still want to proceed?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Proceed',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      const requestId = scannedData[0].requestId;
      const records = scannedData[0].records;
      handleAccept(requestId,records);
      router.replace('/Home/Security/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scanned Data</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {scannedData ? scannedData.length : 0} Entries
          </Text>
        </View>
      </View>

      {scannedData ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {scannedData.map((data, index) => (
            <DataCard key={index} data={data} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data scanned</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title="Submit Record" 
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#e3e8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    color: '#4863ff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  validCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  studentsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  studentsLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  validBadge: {
    backgroundColor: '#e8f5e9',
  },
  expiredBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  rollNumbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  rollNumberBadge: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  rollNumberText: {
    color: '#4863ff',
    fontWeight: '500',
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default QRDataScreen;