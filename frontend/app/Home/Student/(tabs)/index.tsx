import { Image, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useState, useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';

export default function TabOneScreen() {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await AsyncStorage.getItem('userToken');
      const studentId = await AsyncStorage.getItem('studentId');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/leaves/requests/approved`,
        {
          params: { studentId },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setApprovedRequests(response.data);
        setCurrentIndex(0); // Reset to first QR code when new data arrives
      } else {
        setApprovedRequests([]);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQRCode();
    setRefreshing(false);
  };

  const nextQR = () => {
    if (currentIndex < approvedRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousQR = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderQRCode = () => {
    const currentRequest = approvedRequests[currentIndex];
    if (!currentRequest) return null;
    console.log(currentRequest);
    // Create QR code data object
    const qrData = JSON.stringify({
      //requestId: currentRequest.,
      noOfStudents: currentRequest.noOfStudents,
      rollNo:currentRequest.rollNo,
      leaveDate: currentRequest.leaveDate,
      entryDate: currentRequest.entryDate,
      studentId: currentRequest.studentId,
    });

    return (
      <View style={styles.qrWrapper}>
        <QRCode
          value={qrData}
          size={200}
          backgroundColor="white"
          color="black"
        />
        <Text style={styles.dateText}>
          {new Date(currentRequest?.leaveDate).toLocaleDateString()} - {new Date(currentRequest?.entryDate).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/logo.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
        }
      >
        <Text style={styles.title}>Your QR Code</Text>
        
        <View style={styles.qrContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.statusText}>Loading QR Code...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.statusText}>Pull down to try again</Text>
            </View>
          ) : approvedRequests.length > 0 ? (
            <>
              {renderQRCode()}
              {approvedRequests.length > 1 && (
                <View style={styles.navigationContainer}>
                  <TouchableOpacity 
                    onPress={previousQR} 
                    disabled={currentIndex === 0}
                    style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                  >
                    <Text style={styles.navButtonText}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.pageIndicator}>
                    {currentIndex + 1} / {approvedRequests.length}
                  </Text>
                  <TouchableOpacity 
                    onPress={nextQR} 
                    disabled={currentIndex === approvedRequests.length - 1}
                    style={[styles.navButton, currentIndex === approvedRequests.length - 1 && styles.navButtonDisabled]}
                  >
                    <Text style={styles.navButtonText}>→</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noQrContainer}>
              <Text style={styles.statusText}>No active QR code</Text>
              <Text style={styles.statusText}>Pull down to refresh</Text>
            </View>
          )}
        </View>
        
        <View style={styles.separator} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dateText: {
    marginTop: 10,
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  pageIndicator: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  qrContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  noQrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  statusText: {
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 8,
  },
});