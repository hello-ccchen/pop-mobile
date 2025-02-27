class FuelPaymentService {
  private ws: WebSocket | null = null;

  connect(clientId: string, onMessage?: (message: any) => void): void {
    if (this.ws) {
      console.log('WebSocket already connected');
      return;
    }

    this.ws = new WebSocket('ws://10.0.2.2:3002'); // Use your actual server IP

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      this.ws?.send(JSON.stringify({type: 'startFueling', clientId: '12345'}));
    };

    this.ws.onmessage = (event: any) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received:', message);
        onMessage?.(message);

        if (message.type === 'fuelProgress') {
          console.log(`Fueling progress for client ${message.clientId}: ${message.payload}`);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (event: Event) => {
      console.error('WebSocket Error:', event);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.ws = null;
    };
  }

  startFueling(clientId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({type: 'startFueling', clientId}));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const fuelPaymentService = new FuelPaymentService();
