import { HttpException, HttpStatus } from '@nestjs/common';

export class Helper {
  static lessThanTen(value: number): string {
    return value < 10 ? `0${value}` : String(value);
  }

  static getDateMonth(date: Date): string {
    const month: number = date.getUTCMonth() + 1;

    return Helper.lessThanTen(month);
  }

  static getDateYear(date: Date): string {
    return String(date.getUTCFullYear());
  }

  static getDateDay(date: Date): string {
    const day: number = date.getUTCDate();

    return Helper.lessThanTen(day);
  }
  static getTimezoneOffset(date: Date): string {
    const timezone: number= 0 - date.getTimezoneOffset() / 60;

    return String(timezone);
  }

  static getDateHours(date: Date): string {
    const hours: number = date.getUTCHours();

    return Helper.lessThanTen(hours);
  }

  static getDateMinutes(date: Date): string {
    const minutes: number = date.getUTCMinutes();

    return Helper.lessThanTen(minutes);
  }

  static getDateSeconds(date: Date): string {
    const seconds: number = date.getUTCSeconds();

    return Helper.lessThanTen(seconds);
  }

  static prettifyDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    switch (format) {
      case 'YYYY-MM-DD':
        return `${Helper.getDateYear(date)}-${Helper.getDateMonth(date)}-${Helper.getDateDay(date)}`;

      case 'MM-DD':
        return `${Helper.getDateMonth(date)}-${Helper.getDateDay(date)}`;

      case 'HH:MM:SS':
        return `${Helper.getDateHours(date)}:${Helper.getDateMinutes(date)}:${Helper.getDateSeconds(date)}`;

      case 'HH:MM:SS(T)':
        return `${Number(Helper.getDateHours(date)) +
          Number(Helper.getTimezoneOffset(date))}:${Helper.getDateMinutes(
          date,
        )}:${Helper.getDateSeconds(date)}`;

      case 'MM:SS':
        return `${Helper.getDateMinutes(date)}:${Helper.getDateSeconds(date)}`;

      case 'HH-mm':
        return `${Helper.getDateHours(date)}-${Helper.getDateMinutes(date)}`;

      case 'YYYY-MM-DD HH:MM:SS':
        return `${Helper.prettifyDate(date)} ${Helper.prettifyDate(date, 'HH:MM:SS')}`;

      case 'YYYY-MM-DD HH:MM:SS(T)':
        return `${Helper.prettifyDate(date)} ${Helper.prettifyDate(date, 'HH:MM:SS(T)')}`;

      default:
        throw new HttpException('Wrong date format.', HttpStatus.FORBIDDEN);
    }
  }
}
