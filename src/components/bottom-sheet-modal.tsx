import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

interface AppBottomSheetModalProps {
  snapPoints: string[];
  isVisible: boolean;
  onDismiss?: () => void;
  onChange?: (index: number) => void;
  children: React.ReactNode;
  canDismiss?: boolean;
  backdropColor?: string;
}

const AppBottomSheetModal: React.FC<AppBottomSheetModalProps> = ({
  snapPoints,
  isVisible,
  onDismiss,
  onChange,
  children,
  canDismiss = true,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModal = useCallback(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (onChange) {
        onChange(index);
      }
    },
    [onChange],
  );

  const handleDismiss = useCallback(() => {
    if (canDismiss && onDismiss) {
      onDismiss();
    }
  }, [canDismiss, onDismiss]);

  useEffect(() => {
    handlePresentModal();
  }, [isVisible, handlePresentModal]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <TouchableWithoutFeedback onPress={() => canDismiss && handleDismiss()}>
        <View style={StyleSheet.flatten([props.style, {backgroundColor: backdropColor}])} />
      </TouchableWithoutFeedback>
    ),
    [canDismiss, handleDismiss, backdropColor],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={canDismiss}
      onDismiss={handleDismiss}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default AppBottomSheetModal;
