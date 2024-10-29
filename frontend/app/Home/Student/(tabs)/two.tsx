import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.x.x:5000/api'; //replace this with your actual Laptop's IP Address



interface LeaveRequest {
  _id: string;
  rollNo: string[];
  leaveDate: string;
  entryDate: string;
  noOfStudents: number;
  status: string;
  reason: string;
}

const TabTwo = () => {
  const params = useLocalSearchParams<{ scannedData: string }>();
  const router = useRouter();
  //const scannedData = params.scannedData ? JSON.parse(params.scannedData as string) as ScannedData : null;
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
  
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const studentId = await AsyncStorage.getItem('studentId');
      if (!studentId) {
        throw new Error('Student ID not found');
      }
  console.log(token);
      const response = await axios.get(`${API_BASE_URL}/api/leaves/requests`, {
        params: { studentId },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check for success flag in response
      if (response.data.success) {
        setLeaveRequests(response.data.data || []);
        
        // If there are no requests, we can show a user-friendly message
        if (response.data.data.length === 0) {
          setError('No active leave requests found');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch requests');
      }
  
    } catch (error) {
      let errorMessage = 'Failed to fetch requests';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle specific error status codes
          switch (error.response.status) {
            case 400:
              errorMessage = 'Invalid request: ' + (error.response.data?.message || 'Please check your input');
              break;
            case 401:
              errorMessage = 'Session expired. Please login again.';
              // Optionally redirect to login
              break;
            case 403:
              errorMessage = 'You do not have permission to access this resource';
              break;
            default:
              errorMessage = error.response.data?.message || 'An error occurred while fetching requests';
          }
        } else if (error.request) {
          errorMessage = 'No response from server. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

 


  const LeaveRequestCard = ({ item }: { item: LeaveRequest }) => (
    <View style={styles.card}>
      
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Roll Number(s):</Text>
          <Text style={styles.cardValue}>{item.rollNo.join(', ')}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        </View>
        
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Leave Date:</Text>
          <Text style={styles.cardValue}>
            {new Date(item.leaveDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Entry Date:</Text>
          <Text style={styles.cardValue}>
            {new Date(item.entryDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Students:</Text>
          <Text style={styles.cardValue}>{item.noOfStudents}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Reason:</Text>
          <Text style={styles.cardValue}>{item.reason}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      {/*
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
        <Text style={styles.noDataText}>No scanned data available</Text>
      )}

      <View style={styles.divider} />
      
      <Text style={styles.subtitle}>Leave Requests</Text>*/}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchAllRequests}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : leaveRequests.length === 0 ? (
        <Text style={styles.noDataText}>No leave requests found</Text>
      ) : (
        <FlatList
          data={leaveRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <LeaveRequestCard item={item} />}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={fetchAllRequests}
          showsVerticalScrollIndicator={false}
        />
      )}
{/*
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
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
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    minWidth: 100,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TabTwo;