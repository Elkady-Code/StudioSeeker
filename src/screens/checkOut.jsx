import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const CheckoutDetails = ({navigation}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handleProceedWithPayment = () => {
    if (selectedPayment) {
      Alert.alert('Payment Method Selected');
    } else {
      Alert.alert('No Payment Method Selected', 'Please select a payment method');
    }
  };

  const navigateToCheckConfirmation = () => {
    navigation.navigate("CheckoutConfirmation");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>Checkout details</Text>
          <Text style={styles.label}>Time availability:</Text>
          <Text style={styles.label}>Total price:</Text>
          <Text style={styles.label}>Payment method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[styles.paymentButton, selectedPayment === 'Cash' && styles.selectedPaymentButton]}
              onPress={() => handlePaymentSelection('Cash')}
            >
              <Text style={styles.paymentText}>Cash</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.proceedButton} onPress={navigateToCheckConfirmation}>
            <Text style={styles.proceedButtonText}>Proceed with payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedPaymentButton: {
    backgroundColor: 'green',
  },
  paymentText: {
    fontSize: 18,
  },
  proceedButton: {
    backgroundColor: '#C15656',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CheckoutDetails;
