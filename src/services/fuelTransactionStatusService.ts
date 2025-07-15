import * as SignalR from '@microsoft/signalr';
import {logger} from '@services/logger/loggerService';

class FuelTransactionStatusService {
  private connection: SignalR.HubConnection | null;

  constructor() {
    this.connection = null;
  }

  startConnection = async (): Promise<void> => {
    try {
      this.connection = new SignalR.HubConnectionBuilder()
        .withUrl('https://awttechsolution.com/mobile/transactionstatusSignalR')
        .configureLogging(SignalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      await this.connection.start();
      logger.debug('SignalR connection established');
    } catch (err) {
      logger.error('Error establishing SignalR connection:', err);
    }
  };

  invokeMethod = async (methodName: string, ...args: any[]): Promise<any> => {
    if (this.connection) {
      try {
        const result = await this.connection.invoke(methodName, ...args);
        logger.debug(`Method ${methodName} invoked successfully:`, result);
        return result;
      } catch (err) {
        logger.error(`Error invoking method ${methodName}:`, err);
        throw err;
      }
    } else {
      logger.error('Connection has not been established.');
      throw new Error('Connection has not been established.');
    }
  };

  addEventListener = (eventName: string, callback: (...args: any[]) => void): void => {
    if (this.connection) {
      this.connection.on(eventName, callback);
    } else {
      logger.error('Connection has not been established.');
      throw new Error('Connection has not been established.');
    }
  };

  stopConnection = async (): Promise<void> => {
    if (this.connection) {
      try {
        await this.connection.stop();
        logger.debug('SignalR connection stopped');
      } catch (err) {
        logger.error('Error stopping SignalR connection:', err);
      }
    }
  };
}

const fuelTransactionStatusService = new FuelTransactionStatusService();
export default fuelTransactionStatusService;
