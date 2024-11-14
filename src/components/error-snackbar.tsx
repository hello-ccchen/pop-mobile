import {Snackbar} from 'react-native-paper';

interface ErrorSnackbarProps {
  visible: boolean;
  errorMessage: string;
  onDismiss: () => void;
}

const ErrorSnackbar = ({visible, errorMessage, onDismiss}: ErrorSnackbarProps) => (
  <Snackbar visible={visible} onDismiss={onDismiss}>
    {errorMessage}
  </Snackbar>
);

export default ErrorSnackbar;
