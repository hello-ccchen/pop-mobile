import {logger} from '@services/logger/logger-service';
import {Platform} from 'react-native';
import Tts from 'react-native-tts';

// Function to initialize Text-to-Speech (TTS) settings and listeners
export const initializeTtsListeners = async (): Promise<void> => {
  try {
    await Tts.getInitStatus();
    logger.debug('Text To Speech ✅');
  } catch (err: any) {
    if (err.code === 'no_engine') {
      logger.debug('No Text To Speech Engine ✅');
      Tts.requestInstallEngine();
    }
  }

  const rate = Platform.OS === 'ios' ? 0.4 : 0.6;
  // Set TTS settings
  Tts.setDefaultRate(rate, true);
  Tts.setIgnoreSilentSwitch('ignore');
  Tts.setDefaultPitch(0.7);
};

// Function to play a message using TTS
export const playTTS = async (message: string): Promise<void> => {
  try {
    await Tts.getInitStatus();
  } catch (err: any) {
    if (err.code === 'no_engine') {
      logger.debug('No Text To Speech Engine ✅');
      await Tts.requestInstallEngine();
    }
  }

  Tts.speak(message);
};

export const stopTTS = () => {
  Tts.stop();
};
