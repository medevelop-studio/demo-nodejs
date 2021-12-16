export const config: IConfig = {
  // PROD
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

interface IConfig {
  [key: string]: string;
}
