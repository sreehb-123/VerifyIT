import React, { useState } from 'react';
import axios from 'axios';
import { submitRequest } from '@/api';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FormData {
  contacts: string[];
  //emails: string[];
  rolls: string[];
  exitDate: Date;
  exitTime: Date;
  entryDate: Date;
  entryTime: Date;
  reason: string;
}

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  inputBackground: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState<FormData>({
    contacts: [],
    //emails: [],
    rolls: [],
    exitDate: new Date(),
    exitTime: new Date(),
    entryDate: new Date(),
    entryTime: new Date(),
    reason: '',
  });

  //const [currentEmail, setCurrentEmail] = useState<string>('');
  const [currentPhone, setCurrentPhone] = useState<string>('');
  const [currentRoll, setCurrentRoll] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Date picker states
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState<'exitDate' | 'exitTime' | 'entryDate' | 'entryTime'>('exitDate');

  const theme: ThemeColors = {
    background: colorScheme === 'light' ? '#1a1a1a' : '#f5f5f5',
    card: colorScheme === 'light' ? '#2d2d2d' : '#ffffff',
    text: colorScheme === 'light' ? '#ffffff' : '#000000',
    border: colorScheme === 'light' ? '#404040' : '#e0e0e0',
    primary: '#2196F3',
    inputBackground: colorScheme === 'light' ? '#404040' : '#ffffff',
  };

  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  const formatTime = (time: Date): string => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openPicker = (mode: 'date' | 'time', field: 'exitDate' | 'exitTime' | 'entryDate' | 'entryTime') => {
    setPickerMode(mode);
    setCurrentPickerField(field);
    setShowPicker(true);
  };

  const handlePickerChange = (event: any, selectedValue?: Date) => {
    setShowPicker(Platform.OS === 'ios');
  
    if (event.type === 'dismissed' || !selectedValue) {
      return;
    }
  
    setFormData(prev => ({
      ...prev,
      [currentPickerField]: selectedValue
    }));
  };
  

  // const validateEmail = (email: string): boolean => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,10}$/;
    return phoneRegex.test(phone);
  };

  const validateRoll = (roll: string): boolean => {
    const rollRegex = /^[A-Za-z0-9\s-]{9,9}$/;
    return rollRegex.test(roll);
  };

  // const handleEmailInput = (text: string) => {
  //   setCurrentEmail(text);
  //   setErrors({ ...errors, email: '' });

  //   if (text.includes(',') || text.endsWith(' ')) {
  //     const newEmail = text.replace(/[, ]+$/, '').trim();
  //     if (newEmail) {
  //       addEmail(newEmail);
  //     }
  //   }
  // };

  const handlePhoneInput = (text: string) => {
    setCurrentPhone(text);
    setErrors({ ...errors, phone: '' });

    if (text.includes(',') || text.endsWith(' ')) {
      const newPhone = text.replace(/[, ]+$/, '').trim();
      if (newPhone) {
        addPhone(newPhone);
      }
    }
  };

  const handleRollInput = (text: string) => {
    setCurrentRoll(text);
    setErrors({ ...errors, roll: '' });

    if (text.includes(',') || text.endsWith(' ')) {
      const newroll = text.replace(/[, ]+$/, '').trim();
      if (newroll) {
        addRoll(newroll);
      }
    }
  };

  // const addEmail = (email: string) => {
  //   if (!validateEmail(email)) {
  //     setErrors({ ...errors, email: `Invalid email format: ${email}` });
  //     return;
  //   }

  //   if (formData.emails.includes(email)) {
  //     setErrors({ ...errors, email: `Email already exists: ${email}` });
  //     return;
  //   }

  //   setFormData(prev => ({
  //     ...prev,
  //     emails: [...prev.emails, email],
  //   }));
  //   setCurrentEmail('');
  // };

  const addPhone = (phone: string) => {
    if (!validatePhone(phone)) {
      setErrors({ ...errors, phone: `Invalid phone format: ${phone}` });
      return;
    }

    if (formData.contacts.includes(phone)) {
      setErrors({ ...errors, phone: `Phone already exists: ${phone}` });
      return;
    }

    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, phone],
    }));
    setCurrentPhone('');
  };

  const addRoll = (roll: string) => {
    if (!validateRoll(roll)) {
      setErrors({ ...errors, roll: `Invalid roll format: ${roll}` });
      return;
    }

    if (formData.rolls.includes(roll)) {
      setErrors({ ...errors, roll: `roll already exists: ${roll}` });
      return;
    }

    setFormData(prev => ({
      ...prev,
      rolls: [...prev.rolls, roll],
    }));
    setCurrentRoll('');
  };

  // const removeEmail = (emailToRemove: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     emails: prev.emails.filter(email => email !== emailToRemove),
  //   }));
  // };

  const removePhone = (phoneToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(phone => phone !== phoneToRemove),
    }));
  };

  const removeRoll = (rollToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      rolls: prev.rolls.filter(roll => roll !== rollToRemove),
    }));
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    // if (formData.emails.length === 0) {
    //   newErrors.email = 'At least one email is required';
    // }
    if (formData.rolls.length === 0) {
      newErrors.roll = 'At least one roll number is required';
    }

    if (formData.contacts.length === 0) {
      newErrors.phone = 'At least one phone number is required';
    }
    if(formData.reason.length === 0){
      newErrors.reason = 'Reason not provided';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    
    
    const combinedEntry = new Date(formData.entryDate);
  combinedEntry.setHours(formData.entryTime.getHours(), formData.entryTime.getMinutes());

  const combinedExit = new Date(formData.exitDate);
  combinedExit.setHours(formData.exitTime.getHours(), formData.exitTime.getMinutes());

  // Now combinedEntry and combinedExit are based on user input
 // submitRequest(formData.rolls, formData.contacts, formData.rolls.length, formData.reason, combinedEntry, combinedExit);

    submitRequest(formData.rolls,formData.contacts,formData.rolls.length,formData.reason,combinedEntry,combinedExit);
    function onSubmit(){
      Alert.alert('Success', 'Form submitted successfully!');
  }
    
    // Reset form
    setFormData({
      contacts: [],
      // emails: [],
      rolls: [],
      exitDate: new Date(),
      exitTime: new Date(),
      entryDate: new Date(),
      entryTime: new Date(),
      reason: '',
    });
  };

  const renderChips = (items: string[], onRemove: (item: string) => void) => {
    return items.map((item, index) => (
      <View key={index} style={styles.chip}>
        <Text style={styles.chipText}>{item}</Text>
        <TouchableOpacity
          onPress={() => onRemove(item)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const renderDateTimePicker = () => {
    return (
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Exit</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => openPicker('date', 'exitDate')}
          >
            <Text style={styles.dateTimeText}>{formatDate(formData.exitDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => openPicker('time', 'exitTime')}
          >
            <Text style={styles.dateTimeText}>{formatTime(formData.exitTime)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Entry</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => openPicker('date', 'entryDate')}
          >
            <Text style={styles.dateTimeText}>{formatDate(formData.entryDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => openPicker('time', 'entryTime')}
          >
            <Text style={styles.dateTimeText}>{formatTime(formData.entryTime)}</Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <DateTimePicker
            value={formData[currentPickerField]}
            mode={pickerMode}
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
          />
        )}
      </View>
    );
  };
  
  

  const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 20,
      maxWidth: Platform.OS === 'web' ? 600 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
        },
      }),
    },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: Platform.select({ ios: '600', android: 'bold', web: '600' }),
      marginBottom: 10,
      alignItems:'center',
    },
    label: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 8,
      fontWeight: Platform.select({ ios: '500', android: 'bold', web: '500' }),
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      borderRadius: 8,
      padding: 12,
      ...Platform.select({
        web: {
          outlineStyle: 'none',
        },
      }),
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 8,
    },
    chip: {
      flexDirection: 'row',
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignItems: 'center',
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: {
      color: '#fff',
      fontSize: 14,
    },
    removeButton: {
      marginLeft: 4,
      padding: 4,
    },
    removeButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      marginBottom: 8,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: Platform.select({ ios: '600', android: 'bold', web: '600' }),
    },
    dateTimeButton: {
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    dateTimeText: {
      color: theme.text,
      fontSize: 16,
    },
    row: {
      backgroundColor: theme.background,
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Permissions</Text>
          
          {/* <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={`${theme.text}80`}
              value={currentEmail}
              onChangeText={handleEmailInput}
              onSubmitEditing={() => addEmail(currentEmail.trim())}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={styles.chipsContainer}>
            {renderChips(formData.emails, removeEmail)}
          </View> */}

          <Text style={styles.label}>Roll No</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter roll no"
              placeholderTextColor={`${theme.text}80`}
              value={currentRoll}
              onChangeText={handleRollInput}
              onSubmitEditing={() => addRoll(currentRoll.trim())}
            />
          </View>
          {errors.roll && <Text style={styles.errorText}>{errors.roll}</Text>}
          <View style={styles.chipsContainer}>
            {renderChips(formData.rolls, removeRoll)}
          </View>    

          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter phone"
              placeholderTextColor={`${theme.text}80`}
              value={currentPhone}
              onChangeText={handlePhoneInput}
              onSubmitEditing={() => addPhone(currentPhone.trim())}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          <View style={styles.chipsContainer}>
            {renderChips(formData.contacts, removePhone)}
          </View>

          {renderDateTimePicker()}

          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Enter reason"
            placeholderTextColor={`${theme.text}80`}
            value={formData.reason}
            onChangeText={text => setFormData(prev => ({ ...prev, reason: text }))}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;