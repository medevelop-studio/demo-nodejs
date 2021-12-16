import * as dotenv from 'dotenv';

dotenv.config();

export class Env {
  static SERVICE_AUTH = process.env.SERVICE_AUTH || 'auth:3000';
  static SERVICE_USER = process.env.SERVICE_USER || 'user:3001';
  static SERVICE_STATS = process.env.SERVICE_STATS || 'stats:3002';
  static SERVICE_ACTIVATION = process.env.SERVICE_ACTIVATION || 'activation:3003';
  static SERVICE_FIREBASE = process.env.SERVICE_FIREBASE || 'firebase:3006';
  static SERVICE_API = process.env.SERVICE_API || 'api:3007';
  static SERVICE_SCHEDULE = process.env.SERVICE_SCHEDULE || 'schedule:3008';

  static SERVICE_PORT = Number(process.env.SERVICE_PORT) || 3006;

  static USER_SERVICE_LOGIN = process.env.USER_SERVICE_LOGIN || '';
  static USER_SERVICE_PASSWORD = process.env.USER_SERVICE_PASSWORD || '';

  static ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || '';
}
