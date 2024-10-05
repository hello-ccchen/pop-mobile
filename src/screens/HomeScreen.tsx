import React from 'react';
import {View} from 'react-native';
import {Text, Button, Snackbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomTheme from '../styles/custom-theme';

const HomeScreen = () => {
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{margin: 4}}>Home Screen Under construction</Text>
        <Icon name="person-digging" size={14} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button
          style={{margin: 4}}
          icon="thumbs-up"
          mode="contained"
          onPress={onToggleSnackBar}>
          Like
        </Button>

        <Button
          style={{margin: 4}}
          icon="thumbs-down"
          mode="outlined"
          onPress={onToggleSnackBar}>
          Dislike
        </Button>
      </View>
      <Snackbar
        visible={visible}
        style={{backgroundColor: CustomTheme.colors.primary}}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
        }}>
        Thanks for your feedback!
      </Snackbar>
    </View>
  );
};

export default HomeScreen;
