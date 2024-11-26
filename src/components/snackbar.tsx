import {Snackbar} from 'react-native-paper';

interface AppSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

const AppSnackbar = ({visible, message, onDismiss}: AppSnackbarProps) => (
  <Snackbar visible={visible} onDismiss={onDismiss}>
    {message}
  </Snackbar>
);

export default AppSnackbar;
