import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://30b925e560142291831b7d10c723e3e8@o4508521974464512.ingest.de.sentry.io/4508522136600656',
});

class SentryLogger {
  debug(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(message, {level: 'debug', extra: {params: optionalParams}});
  }

  info(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(message, {level: 'info', extra: {params: optionalParams}});
  }

  warn(message: string, ...optionalParams: any[]) {
    Sentry.captureMessage(message, {level: 'warning', extra: {params: optionalParams}});
  }

  error(message: string, ...optionalParams: any[]) {
    const error = new Error(message);
    Sentry.captureException(error, {
      extra: {params: optionalParams},
    });
  }
}

export default SentryLogger;
