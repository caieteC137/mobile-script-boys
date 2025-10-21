// components/ButtonPrimary.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const ButtonPrimary = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary' // primary, success, error
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.button, styles.successButton, disabled && styles.disabledButton];
      case 'error':
        return [styles.button, styles.errorButton, disabled && styles.disabledButton];
      default:
        return [styles.button, styles.primaryButton, disabled && styles.disabledButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.buttonText, styles.successButtonText];
      case 'error':
        return [styles.buttonText, styles.errorButtonText];
      default:
        return [styles.buttonText, styles.primaryButtonText];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#C17E3A',
  },
  successButton: {
    backgroundColor: '#4A7C59',
  },
  errorButton: {
    backgroundColor: '#A8402E',
  },
  disabledButton: {
    backgroundColor: '#D0D0D0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  successButtonText: {
    color: '#FFFFFF',
  },
  errorButtonText: {
    color: '#FFFFFF',
  },
});

export default ButtonPrimary;
