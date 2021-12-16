export class AppStats {
  constructor(
    public selectedName: string,
    public online: number,
  ) {}
}

export class ResponseStatsDto {
  constructor(
    public statsByCountry: AppStats[],
    public statsByState: AppStats[],
  ) {}
}
