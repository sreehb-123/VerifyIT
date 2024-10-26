import React, { useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Button } from 'react-native';

const ActiveRequestsScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const requests: Request[] = [
    { 
      id: '1', 
      email: 'user21@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,user1@example.com,', 
      reason: 'Medical Appointment details hvj mjbyuf kjgyu jbjgyuy jhuf buyfiydi jyguodi6s uiguf', 
      outTime: '12/12/1002 1:00 PM', 
      inTime: '13/17/2009 3:00 PM' 
    },
    { 
      id: '2', 
      email: 'user2@example.com', 
      reason: 'Family Emergency details...', 
      outTime: '12/12/1002 1:00 PM', 
      inTime: '13/17/2009 3:00 PM'
    },
  ];
  
  interface Request {
    id: string;
    email: string;
    reason: string;
    outTime: string;
    inTime: string;
  }

  const handleAccept = (id: string) => {
    console.log(`Accepted request ID: ${id}`);
  };

  const handleDecline = (id: string) => {
    console.log(`Declined request ID: ${id}`);
  };

  const toggleFull = (index: number, request: Request) => {
    if (modalVisible == true) {
      setExpandedIndex(null);
      setModalVisible(false);
    } else {
      setSelectedRequest(request);
      setModalVisible(true);
    }
  };
  const toggleReason = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const renderItem = ({ item, index }: { item: Request; index: number }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <Text style={styles.emailText} numberOfLines={1}>
          {item.email}
        </Text>
        <Text onPress={() => toggleFull(index, item)} style={styles.expandText}>Expand</Text>
      </View>
      
      <TouchableOpacity onPress={() => toggleReason(index)} style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value} numberOfLines={expandedIndex === index ? undefined : 1}>
            {item.reason}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.timeContainer}>
        <View style={styles.timeDetail}>
          <Text style={styles.label}>Out:</Text>
          <Text style={styles.value2}>{item.outTime}</Text>
        </View>
        
        <View style={styles.timeDetail}>
          <Text style={styles.label}>In:</Text>
          <Text style={styles.value2}>{item.inTime}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.declineButton]}
          onPress={() => handleDecline(item.id)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Details</Text>
            <View style={styles.emailListContainer}>
              <Text style={styles.label}>Emails:</Text>
                {selectedRequest?.email.split(',').map((email, idx) => (
                  <Text key={idx} style={styles.emailItem}>{email.trim()}</Text>
                ))}
          </View>
            <Text style={styles.modalReason}>{selectedRequest?.reason}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
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
    marginBottom: 7,
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
});

export default ActiveRequestsScreen;
4