import React, {useRef} from 'react';
import {TextInput as RNTextInput, SafeAreaView, StyleSheet, View} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {ProfileRequestPayload, User} from 'src/types';

import EmailInput from '@components/EmailInput';
import AppSnackbar from '@components/Snackbar';
import useForm from '@hooks/useForm';
import {ProfileService} from '@services/profileService';
import useStore from '@store/index';
import theme from '@styles/theme';

const ProfileScreen = () => {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);

  const {
    formData,
    validationErrors,
    handleChangeText,
    setValidationErrors,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  } = useForm({
    email: user!.email,
    mobile: user!.mobile,
    fullname: user!.fullName,
  });

  const mobilePhoneRef = useRef<RNTextInput>(null);

  // State to handle the success message
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.mobile) {
      errors.mobile = 'Mobile phone number is required';
    }
    if (!formData.fullname) {
      errors.fullname = 'Fullname is required';
    }

    const phoneRegex = /^\+?\d{1,20}$/;
    if (formData.mobile && !phoneRegex.test(formData.mobile)) {
      errors.mobile =
        'Please enter a valid mobile phone number, only plus (+) symbol and number are accepted';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!isValidFormData()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setSuccessMessage(null); // Reset success message before starting the update

    const profilePayload: ProfileRequestPayload = {
      mobile: formData.mobile,
      fullName: formData.fullname,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const response = await ProfileService.updateProfile(profilePayload);
      setUser({
        ...(user as User),
        fullName: response.fullName,
        mobile: response.mobile,
      });
      // Set success message
      setSuccessMessage('Profile updated successfully! 🎉');
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <EmailInput
          value={formData.email}
          onChangeText={value => handleChangeText('email', value)}
          errorMessage={validationErrors.email}
          disabled={true}
        />
      </View>

      <View style={styles.textContainer}>
        <TextInput
          label="Fullname"
          mode="outlined"
          value={formData.fullname}
          onChangeText={value => handleChangeText('fullname', value)}
          error={Boolean(validationErrors.fullname)}
          disabled={isLoading}
          returnKeyType="next"
          onSubmitEditing={() => {
            mobilePhoneRef.current?.focus();
          }}
        />
        {validationErrors.fullname && (
          <HelperText type="error">{validationErrors.fullname}</HelperText>
        )}
      </View>

      <View style={styles.textContainer}>
        <TextInput
          ref={mobilePhoneRef}
          label="Mobile Phone Number"
          mode="outlined"
          keyboardType="phone-pad"
          value={formData.mobile}
          onChangeText={value => handleChangeText('mobile', value)}
          error={Boolean(validationErrors.mobile)}
          disabled={isLoading}
          returnKeyType="done"
          onSubmitEditing={handleUpdateProfile}
          maxLength={20}
        />
        {validationErrors.mobile && <HelperText type="error">{validationErrors.mobile}</HelperText>}
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleUpdateProfile} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </View>

      {/* AppSnackbar Component */}
      <AppSnackbar
        visible={isError || !!successMessage}
        message={
          isError ? 'Uh-oh... We can’t update your profile right now. 🥹' : successMessage || ''
        }
        onDismiss={() => {
          setIsError(false);
          setSuccessMessage(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
