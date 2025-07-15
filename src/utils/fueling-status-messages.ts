import {FuelProgressStatus} from 'src/types';

export const getFuelingStatusMessages = (
  isGas: boolean,
  productInfo: string | null,
): Record<FuelProgressStatus, string> => {
  return {
    processing: 'Processing Payment...',
    connecting: `Connecting to ${isGas ? 'Pump' : 'EV Charger'}...`,
    ready: isGas ? 'Ready to Fuel. Pick up the pump!' : 'Ready to Charge. Pick up the EV Charger',
    fueling: productInfo
      ? `${isGas ? 'Fueling' : 'Charging'} ${productInfo} in Progress...`
      : `${isGas ? 'Fueling' : 'Charging'} in Progress...`,
    completed: productInfo
      ? `${isGas ? 'Fueling' : 'Charging'} ${productInfo} Completed!`
      : `${isGas ? 'Fueling' : 'Charging'} Completed!`,
    error: `Failed to ${isGas ? 'Fuel' : 'Charge'}, Please proceed to the counter for assistance.`,
  };
};
