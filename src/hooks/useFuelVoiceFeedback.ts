import {getFuelingStatusMessages} from '@utils/fuelingStatusMessagesHelper';
import {initializeTtsListeners, playTTS, stopTTS} from '@utils/textToSpeechHelper';
import {useEffect, useRef} from 'react';
import {FuelProgressStatus} from 'src/types';

const useFuelingVoiceFeedback = (
  status: FuelProgressStatus,
  productInfo: string | null,
  isGas: boolean,
) => {
  const lastSpokenStatus = useRef<string | null>(null); // Track last spoken status

  useEffect(() => {
    const speakStatus = async () => {
      await initializeTtsListeners(); // Ensure TTS is initialized

      // 🚨 Prevent repeating the same message
      if (lastSpokenStatus.current === status) {
        return;
      }

      stopTTS(); // Stop any ongoing speech before speaking a new message

      const messages = getFuelingStatusMessages(isGas, productInfo);

      if (messages[status]) {
        await playTTS(messages[status]); // Speak new status
        lastSpokenStatus.current = status; // Update last spoken status
      }
    };

    speakStatus();
  }, [status, productInfo, isGas]);
};

export default useFuelingVoiceFeedback;
