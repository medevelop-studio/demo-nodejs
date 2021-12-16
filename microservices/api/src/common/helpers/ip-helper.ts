export default class Ip {
  private value: string;

  constructor(ip: string) {
    this.value = ip;
  }

  toFakeString(): string {
    const ip: string = this.value;
    const period: number = Math.floor(ip.length / 3);
    const segments: string[] = ip.split('.');

    const key = [0, 1, 2].map((i) => {
      const offset = i * period;

      return ip.charCodeAt(offset) || offset;
    });

    segments[2] = (Number.parseInt(segments[2]) ^ key[0]).toString();
    segments[3] = (Number.parseInt(segments[3]) ^ key[2]).toString();

    return segments.join('.');
  }

  toMaskedString(): string {
    return this.value.replace(/\.[0-9]{1,3}$/, '.XX');
  }

  static isValid(ip: string): boolean {
    const regex: RegExp = new RegExp(
      '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.'
      + '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    );

    return regex.test(String(ip));
  }

  toNumber(): number {
    const splittedIp: string[] = this.value.split('.');

    if (splittedIp.length !== 4) {return 0;}

    return Number(splittedIp.map((chunk) => `000${chunk}`.substr(-3)).join(''));
  }

  isInRange(rangeStart: string, rangeEnd: string): boolean {
    const rangeStartAsNum: number = new Ip(rangeStart).toNumber();
    const rangeEndAsNum: number = new Ip(rangeEnd).toNumber();
    const thisIpAsNum: number = this.toNumber();

    if (rangeStartAsNum === 0 || rangeEndAsNum === 0 || thisIpAsNum === 0) {
      return false;
    }

    return rangeStartAsNum <= thisIpAsNum && rangeEndAsNum >= thisIpAsNum;
  }
}
