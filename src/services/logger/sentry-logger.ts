import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://30b925e560142291831b7d10c723e3e8@o4508521974464512.ingest.de.sentry.io/4508522136600656',
});

class SentryLogger {
  debug(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(`DEBUG: ${message}`, 'debug');
    console.debug(message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(`INFO: ${message}`, 'info');
    console.info(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(`WARN: ${message}`, 'warning');
    console.warn(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    Sentry.captureException(new Error(message));
    console.error(message, ...optionalParams);
  }
}

export default SentryLogger;
