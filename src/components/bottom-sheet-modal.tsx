import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';

interface AppBottomSheetModalProps {
  snapPoints: string[];
  isVisible: boolean;
  onDismiss?: () => void;
  onChange?: (index: number) => void;
  children: React.ReactNode;
}

const AppBottomSheetModal: React.FC<AppBottomSheetModalProps> = ({
  snapPoints,
  isVisible,
  onDismiss,
  onChange,
  children,
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
      if (onChange) onChange(index);
    },
    [onChange],
  );

  // Make sure the modal is presented or dismissed when visibility changes
  useEffect(() => {
    handlePresentModal();
  }, [isVisible, handlePresentModal]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      onDismiss={onDismiss}
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default AppBottomSheetModal;
