import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import AppBottomSheetModal from './bottom-sheet-modal';

interface AppSelectionButtonProps {
  buttonText: string;
  children: React.ReactNode;
}

const AppSelectionButton: React.FC<AppSelectionButtonProps> = ({buttonText, children}) => {
  const [isSheetVisible, setIsSheetVisible] = useState<boolean>(false);
  return (
    <View>
      <TouchableOpacity style={styles.selectionButton} onPress={() => setIsSheetVisible(true)}>
        <Text style={styles.selectionButtonText}>{buttonText}</Text>
        <Icon
          name={isSheetVisible ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#000"
          style={styles.selectionButtonIcon}
        />
      </TouchableOpacity>

      {/* Selection Bottom Sheet */}
      <AppBottomSheetModal
        isVisible={isSheetVisible}
        onDismiss={() => setIsSheetVisible(false)}
        snapPoints={['40%']}>
        <View style={styles.bottomSheetContainer}>{children}</View>
      </AppBottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  selectionButtonText: {
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
  selectionButtonIcon: {
    marginLeft: 10,
  },
  bottomSheetContainer: {
    padding: 20,
  },
});
export default AppSelectionButton;
