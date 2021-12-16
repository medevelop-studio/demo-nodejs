export class ObjectHelper {
  public static reassign<Target, Data>(target: Target, data: Data, excludingKeys: string[] = []): Target {
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined && data[key] !== null && !excludingKeys.includes(key)) {
        target[key] = data[key];
      }
    }

    return target;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static convertEnumToArray(enumObject): string[] {
    const all: string[] = [];
    // eslint-disable-next-line guard-for-in
    for (const key in enumObject) {
      all.push(String(enumObject[key]));
    }
    return all;
  }
}
