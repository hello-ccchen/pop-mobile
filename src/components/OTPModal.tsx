import React, {useRef, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, TextInput as RNTextInput, Text} from 'react-native';
import {Button} from 'react-native-paper';
import AppBottomSheetModal from './BottomSheetModal';

interface OTPModalProps {
  userEmail: string;
  isVisible: boolean;
  resendTime?: number;
  onDismiss: () => void;
  onOTPComplete: (otp: string) => void;
  onResendOTP: () => void;
}

const OTP_LENGTH = 6;

const OneTimePasswordModal: React.FC<OTPModalProps> = ({
  userEmail,
  isVisible,
  resendTime = 60,
  onDismiss,
  onOTPComplete,
  onResendOTP,
}) => {
  const inputRefs = useRef<RNTextInput[]>([]);
  const [oneTimePassword, setOneTimePassword] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState<number>(resendTime);
  const [isCallbackTriggered, setIsCallbackTriggered] = useState<boolean>(false);

  useEffect(() => {
    if (
      oneTimePassword.every(digit => digit.match(/^\d$/)) &&
      oneTimePassword.join('').length === OTP_LENGTH &&
      !isCallbackTriggered
    ) {
      setIsCallbackTriggered(true);
      onOTPComplete(oneTimePassword.join(''));
    }
  }, [oneTimePassword, isCallbackTriggered, onOTPComplete]);

  useEffect(() => {
    if (isVisible) {
      setOneTimePassword(new Array(OTP_LENGTH).fill(''));
      setIsCallbackTriggered(false);
      setCountdown(resendTime);
    }
  }, [isVisible, resendTime]);

  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVisible]);

  const handleChange = useCallback((value: string, index: number) => {
    value = value.trim();
    if (/^\d*$/.test(value)) {
      setOneTimePassword(prev => {
        const updatedOtp = [...prev];
        updatedOtp[index] = value;
        return updatedOtp;
      });

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, []);

  const handleBackspace = useCallback((value: string, index: number) => {
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, []);

  const handleResendOtp = useCallback(() => {
    setCountdown(resendTime);
    setOneTimePassword(new Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    onResendOTP();
  }, [onResendOTP, resendTime]);

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.slice(0, 2) + '***';
    return `${maskedUser}@${domain}`;
  };

  return (
    <AppBottomSheetModal
      isVisible={isVisible}
      snapPoints={['75%']}
      onDismiss={onDismiss}
      canDismiss={oneTimePassword.every(
        digit => digit.match(/^\d$/) && oneTimePassword.join('').length === OTP_LENGTH,
      )}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          An OTP (One Time Password) has been sent to your email:{' '}
          <Text style={styles.emailText}>{maskEmail(userEmail)}</Text> for verification. Please
          check your inbox and spam folder.
        </Text>
      </View>
      <View style={styles.otpContainer}>
        {oneTimePassword.map((digit, index) => (
          <RNTextInput
            accessible
            accessibilityLabel={`Enter OTP digit ${index + 1}`}
            accessibilityRole="keyboardkey"
            key={index}
            value={digit}
            onChangeText={value => handleChange(value, index)}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(digit, index);
              }
            }}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            ref={(ref: RNTextInput) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        {countdown > 0 ? (
          <Text style={styles.countdownText}>Request a new OTP in {countdown} seconds</Text>
        ) : (
          <Button mode="text" onPress={handleResendOtp}>
            Resend OTP
          </Button>
        )}
      </View>
    </AppBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  emailText: {
    fontWeight: 'bold',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  countdownText: {
    fontSize: 14,
    color: '#666',
  },
});

export default OneTimePasswordModal;
