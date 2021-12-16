import * as dotenv from 'dotenv';

dotenv.config();

export class Env {
  static DB_HOST = process.env.DB_HOST || '';
  static DB_PORT = Number(process.env.DB_PORT) || 5432;
  static DB_NAME = process.env.DB_NAME || '';
  static DB_USER = process.env.DB_USER || '';
  static DB_PASS = process.env.DB_PASS || '';

  static SERVICE_AUTH = process.env.SERVICE_AUTH || 'auth:3000';
  static SERVICE_USER = process.env.SERVICE_USER || 'user:3001';
  static SERVICE_STATS = process.env.SERVICE_STATS || 'stats:3002';
  static SERVICE_ACTIVATION = process.env.SERVICE_ACTIVATION || 'activation:3003';
  static SERVICE_FIREBASE = process.env.SERVICE_FIREBASE || 'firebase:3006';
  static SERVICE_API = process.env.SERVICE_API || 'api:3007';
  static SERVICE_SCHEDULE = process.env.SERVICE_SCHEDULE || 'schedule:3008';

  static SERVICE_PORT = Number(process.env.SERVICE_PORT) || 3001;

  static USER_SERVICE_LOGIN = process.env.USER_SERVICE_LOGIN || '';
  static USER_SERVICE_PASSWORD = process.env.USER_SERVICE_PASSWORD || '';

  static JWT_SECRET = process.env.JWT_SECRET || '';
  static JWT_EXPIRATION_IN_SECONDS = Number(process.env.JWT_EXPIRATION_IN_SECONDS) || 36000;
  static PASS_SALT = process.env.PASS_SALT || '';

  static DEBUG_ORM = process.env.DEBUG_ORM || true;

  static ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || '';
}
