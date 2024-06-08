import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CheckoutDetails = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const handleProceedWithPayment = () => {
    if (selectedPayment) {
      Alert.alert('Payment Method Selected', You have selected ${selectedPayment});
    } else {
      Alert.alert('No Payment Method Selected', 'Please select a payment method');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout details</Text>
      <Text style={styles.label}>time availability:</Text>
      <Text style={styles.label}>total price:</Text>
      <Text style={styles.label}>payment method</Text>
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[styles.paymentButton, selectedPayment === 'Cash' && styles.selectedPaymentButton]}
          onPress={() => handlePaymentSelection('Cash')}
        >
          <Text style={styles.paymentText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, selectedPayment === 'Visa' && styles.selectedPaymentButton]}
          onPress={() => handlePaymentSelection('Visa')}
        >
          <Text style={styles.paymentText}>Visa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, selectedPayment === 'Instapay' && styles.selectedPaymentButton]}
          onPress={() => handlePaymentSelection('Instapay')}
        >
          <Text style={styles.paymentText}>Instapay</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.proceedButton} onPress={handleProceedWithPayment}>
        <Text style={styles.proceedButtonText}>Proceed with payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
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
    backgroundColor: 'red',
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