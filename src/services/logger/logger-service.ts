import {consoleTransport, logger as RNLogger} from 'react-native-logs';
import SentryLogger from './sentry-logger';

const localLogger = RNLogger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
});

const isProduction = process.env.NODE_ENV === 'production';

export const logger = isProduction ? new SentryLogger() : localLogger;
