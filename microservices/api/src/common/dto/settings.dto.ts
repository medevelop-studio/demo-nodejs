export class SettingsDto {
  id: number;
  keepAlive: number;
  appDeadDelay: number;
  useLifetime: number;
  cachedHostsLifetime: number;
  appTotalUsedLifetime: number;
  statsLifetime: number;
  isAllowAllCountriesExcept: boolean;
}
