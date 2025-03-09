import * as SignalR from '@microsoft/signalr';

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
      console.log('SignalR connection established');
    } catch (err) {
      console.error('Error establishing SignalR connection:', err);
    }
  };

  invokeMethod = async (methodName: string, ...args: any[]): Promise<any> => {
    if (this.connection) {
      try {
        const result = await this.connection.invoke(methodName, ...args);
        console.log(`Method ${methodName} invoked successfully:`, result);
        return result;
      } catch (err) {
        console.error(`Error invoking method ${methodName}:`, err);
        throw err;
      }
    } else {
      console.error('Connection has not been established.');
      throw new Error('Connection has not been established.');
    }
  };

  addEventListener = (eventName: string, callback: (...args: any[]) => void): void => {
    if (this.connection) {
      this.connection.on(eventName, callback);
    } else {
      console.error('Connection has not been established.');
      throw new Error('Connection has not been established.');
    }
  };

  stopConnection = async (): Promise<void> => {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR connection stopped');
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      }
    }
  };
}

const fuelTransactionStatusService = new FuelTransactionStatusService();
export default fuelTransactionStatusService;
