import {initializeTtsListeners, playTTS, stopTTS} from '@utils/text-to-speech-helper';
import {useEffect} from 'react';

const useFuelingVoiceFeedback = (status: string, productInfo: string | null) => {
  useEffect(() => {
    const speakStatus = async () => {
      await initializeTtsListeners(); // Ensure initialization before speaking
      stopTTS(); // Stop any ongoing speech before speaking a new message
      const messages: Record<string, string> = {
        processing: 'Processing Payment...',
        connecting: 'Connecting to Pump...',
        ready: 'Ready to Fuel. Pick up the pump!',
        fueling: productInfo ? `Fueling ${productInfo} in Progress...` : 'Fueling in Progress...',
        completed: productInfo ? `Fueling ${productInfo} Completed!` : 'Fueling Completed!',
        error: 'Failed to Fueling, Please proceed to the counter for assistance.',
      };

      if (messages[status]) {
        await playTTS(messages[status]); // Ensure TTS execution completes
      }
    };

    speakStatus();
  }, [status, productInfo]);
};

export default useFuelingVoiceFeedback;
