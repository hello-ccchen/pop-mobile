import React, {forwardRef} from 'react';
import {TextInput as RNTextInput, ReturnKeyTypeOptions, View} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';

interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  disabled?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

const EmailInput = forwardRef<React.ElementRef<typeof RNTextInput>, EmailInputProps>(
  ({value, onChangeText, errorMessage, disabled, returnKeyType, onSubmitEditing}, ref) => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showError = Boolean(errorMessage) || (value && !isValidEmail(value));

    return (
      <View>
        <TextInput
          ref={ref}
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          value={value}
          onChangeText={onChangeText}
          error={!!showError}
          disabled={disabled}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {showError && (
          <HelperText type="error" visible={showError}>
            {errorMessage || 'Please enter a valid email address'}
          </HelperText>
        )}
      </View>
    );
  },
);

export default EmailInput;
