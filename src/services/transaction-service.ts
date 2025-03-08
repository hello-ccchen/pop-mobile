import {Transaction} from '@store/index';
import uuid from 'react-native-uuid';

const getRandomPastDate = (days: number) => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * days));
  return pastDate.toISOString();
};

const getRandomAmount = () => [30, 40, 50, 60][Math.floor(Math.random() * 4)];

const stations = [
  {
    name: 'Shell Express',
    address: '123 Main St, Springfield',
  },
  {
    name: 'Petronas KL',
    address: '456 Jalan Ampang, KL',
  },
  {
    name: 'Caltex Highway',
    address: '789 Federal Hwy, Selangor',
  },
  {
    name: 'Esso Town',
    address: '101 City Road, Johor Bahru',
  },
];

// Mock API to simulate fetching transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  return new Promise(resolve => {
    const transactions = Array.from({length: 20}, () => {
      const station = stations[Math.floor(Math.random() * stations.length)];
      return {
        transactionId: uuid.v4(),
        transactionDateTime: getRandomPastDate(30), // Get a random date in the last 30 days
        paymentCard: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
        fuelAmount: getRandomAmount(),
        stationPumpNumber: Math.floor(Math.random() * 10) + 1,
        stationName: station.name,
        stationAddress: station.address,
        loyaltyCard:
          Math.random() > 0.5 ? `LOYALTY${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      };
    });

    setTimeout(() => {
      resolve(transactions);
    }, 1000);
  });
};
