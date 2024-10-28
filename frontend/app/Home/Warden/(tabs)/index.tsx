import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define your API base URL - replace with your actual API URL
const API_BASE_URL = 'https://1e5f-103-120-31-122.ngrok-free.app'; // Replace X with your actual local IP

interface PendingRequest {
  _id: string;
  rollNo: string[];
  phoneNo: string[];
  leaveDate: string;
  entryDate: string;
  reason: string;
  status: string;
  noOfStudents: number;
}

const ActiveRequestsScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      //console.log('hello');
      
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');//asyncStorage

      console.log('token:',token);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/api/leaves/requests/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        setPendingRequests(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch active requests';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.message}`;
        } else if (error.request) {
          errorMessage = 'No response from server. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    //const refreshInterval = setInterval(fetchPendingRequests, 60000);
    
    //return () => clearInterval(refreshInterval);
  }, []);

  const handleAccept = async (id: string) => {
    console.log(id);
    try {
      const token = await AsyncStorage.getItem('userToken');

      console.log(token);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.patch(`${API_BASE_URL}/api/leaves/requests/update`, {
        id,
        status: "approved"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      
      // Refresh the list after accepting
      fetchPendingRequests();
      Alert.alert('Success', 'Request accepted successfully');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to accept request';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.patch(`${API_BASE_URL}/api/leaves/requests/update`, {
        id,
        status: "declined"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      
      // Refresh the list after accepting
      fetchPendingRequests();
      Alert.alert('Success', 'Request accepted successfully');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to accept request';
      Alert.alert('Error', errorMessage);
    }
  };

  const toggleFull = (request: PendingRequest) => {
    if (modalVisible) {
      setModalVisible(false);
      setSelectedRequest(null);
    } else {
      setSelectedRequest(request);
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }: { item: PendingRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <Text style={styles.emailText} numberOfLines={1}>
          Roll No: {item.rollNo.join(', ')}
        </Text>
        <Text onPress={() => toggleFull(item)} style={styles.expandText}>
          Expand
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeDetail}>
          <Text style={styles.label}>Leave Date:</Text>
          <Text style={styles.value2}>
            {new Date(item.leaveDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.timeDetail}>
          <Text style={styles.label}>Entry Date:</Text>
          <Text style={styles.value2}>
            {new Date(item.entryDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleDecline(item._id)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAccept(item._id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pending Requests</Text>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text>Loading requests...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchPendingRequests}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!isLoading && !error && pendingRequests.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text>No pending requests found</Text>
        </View>
      )}

      {!isLoading && !error && pendingRequests.length > 0 && (
        <FlatList
          data={pendingRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={fetchPendingRequests}
        />
      )}

<Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Request Details</Text>
            
            <View style={styles.emailListContainer}>
              <Text style={styles.label}>Roll Numbers:</Text>
              {selectedRequest?.rollNo.map((roll, idx) => (
                <Text key={idx} style={styles.emailItem}>{roll.trim()}</Text>
              ))}
            </View>
            
            <View style={styles.emailListContainer}>
              <Text style={styles.label}>Phone Numbers:</Text>
              {selectedRequest?.phoneNo.map((phone, idx) => (
                <Text key={idx} style={styles.emailItem}>{phone.trim()}</Text>
              ))}
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Number of Students: <Text style={styles.value}>{selectedRequest?.noOfStudents}</Text> </Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Reason:</Text>
              <Text style={styles.modalReason}>{selectedRequest?.reason}</Text>
            </View>
            
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/*
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pending Requests:</Text>
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Request Details</Text>
            
            <View style={styles.emailListContainer}>
              <Text style={styles.label}>Roll Numbers:</Text>
              {selectedRequest?.rollNo.map((roll, idx) => (
                <Text key={idx} style={styles.emailItem}>{roll.trim()}</Text>
              ))}
            </View>
            
            <View style={styles.emailListContainer}>
              <Text style={styles.label}>Phone Numbers:</Text>
              {selectedRequest?.phoneNo.map((phone, idx) => (
                <Text key={idx} style={styles.emailItem}>{phone.trim()}</Text>
              ))}
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Number of Students:</Text>
              <Text style={styles.value}>{selectedRequest?.noOfStudents}</Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.label}>Reason:</Text>
              <Text style={styles.modalReason}>{selectedRequest?.reason}</Text>
            </View>
            
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};*/

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  header:{
    fontSize: 21,
    fontWeight: 'bold',
    marginLeft: 16,
    paddingBottom:10,
    color: '#333',
  },
  requestItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    marginRight: 6,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight:20,
  },
  expandText: {
    color: '#007BFF',
    marginRight: 6,
  },
  detailsContainer: {
    //marginBottom: 7,
  },
  detail: {
    flexDirection: 'column',
  },
  timeContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  value2: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    //alignItems: '',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalReason: {
    marginBottom: 20,
  },
  emailListContainer: {
    display:'flex',
    justifyContent:'flex-start',
    marginTop: 8,
  },
  emailItem: {
    marginLeft: 10,
    fontSize: 14,
    color: '#1a1a1a',
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
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActiveRequestsScreen;