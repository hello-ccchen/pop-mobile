import React, {forwardRef, useState} from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {View, TextInput as RNTextInput, ReturnKeyTypeOptions} from 'react-native';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

const PasswordInput = forwardRef<React.ElementRef<typeof RNTextInput>, PasswordInputProps>(
  (
    {
      value,
      onChangeText,
      errorMessage,
      placeholder = 'Password',
      disabled,
      returnKeyType,
      onSubmitEditing,
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const showError = Boolean(errorMessage);

    return (
      <View>
        <TextInput
          ref={ref}
          label={placeholder}
          mode="outlined"
          secureTextEntry={!isPasswordVisible}
          textContentType="password"
          value={value}
          onChangeText={onChangeText}
          error={!!showError}
          disabled={disabled}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          right={
            <TextInput.Icon
              icon={isPasswordVisible ? 'eye' : 'eye-slash'}
              onPress={togglePasswordVisibility}
            />
          }
        />
        {showError && (
          <HelperText type="error" visible={showError}>
            {errorMessage}
          </HelperText>
        )}
      </View>
    );
  },
);

export default PasswordInput;
