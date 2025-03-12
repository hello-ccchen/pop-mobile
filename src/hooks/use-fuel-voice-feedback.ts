import {initializeTtsListeners, playTTS, stopTTS} from '@utils/text-to-speech-helper';
import {useEffect, useRef} from 'react';

const useFuelingVoiceFeedback = (status: string, productInfo: string | null) => {
  const lastSpokenStatus = useRef<string | null>(null); // Track last spoken status

  useEffect(() => {
    const speakStatus = async () => {
      await initializeTtsListeners(); // Ensure TTS is initialized

      const messages: Record<string, string> = {
        processing: 'Processing Payment...',
        connecting: 'Connecting to Pump...',
        ready: 'Ready to Fuel. Pick up the pump!',
        fueling: productInfo ? `Fueling ${productInfo} in Progress...` : 'Fueling in Progress...',
        completed: productInfo ? `Fueling ${productInfo} Completed!` : 'Fueling Completed!',
        error: 'Failed to Fueling, Please proceed to the counter for assistance.',
      };

      // 🚨 Prevent repeating the same message
      if (lastSpokenStatus.current === status) {
        return;
      }

      stopTTS(); // Stop any ongoing speech before speaking a new message

      if (messages[status]) {
        await playTTS(messages[status]); // Speak new status
        lastSpokenStatus.current = status; // Update last spoken status
      }
    };

    speakStatus();
  }, [status, productInfo]);
};

export default useFuelingVoiceFeedback;
