import { HttpException, HttpStatus } from '@nestjs/common';

export const convertStrToNumberArr = (
  data: string,
  minValue?: number,
  maxValue?: number,
): number[] => {
  let values: string[];

  try {
    values = JSON.parse(data);
  } catch (err) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  return processNumberArray(values, minValue, maxValue);
};

export const convertStrToStringArr = (
  data: string,
  minLength?: number,
  maxLength?: number,
): string[] => {
  let values: string[];

  try {
    values = JSON.parse(data);
  } catch (err) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  return processStringArray(values, minLength, maxLength);
};

export const convertStringToStringArr = (
  data: string,
  delimiter: string,
  minLength?: number,
  maxLength?: number,
  upper: boolean = true,
): string[] => {
  const values: string[] = data.split(delimiter).map(item => upper ? item.trim().toUpperCase() : item.trim().toLowerCase());

  return processStringArray(values, minLength, maxLength);
};

export const convertStringToNumberArr = (
  data: string,
  delimiter: string,
  minValue?: number,
  maxValue?: number,
): number[] => {
  const values: string[] = data.split(delimiter);

  return processNumberArray(values, minValue, maxValue);
};

const processNumberArray = (
  values: string[],
  minValue?: number,
  maxValue?: number,
): number[] => {
  if (!Array.isArray(values)) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  if (!values) {
    throw new HttpException('Please, request the valid ids array.', HttpStatus.BAD_REQUEST);
  }

  if (values.length === 0) {
    throw new HttpException('Please, request the valid ids array. Array is empty.', HttpStatus.BAD_REQUEST);
  }

  return values.map((value) => {
    const newValue: number = Number(value);

    if (Number.isNaN(newValue)) {
      throw new HttpException(
        'Please, request the valid ids string array. Minimum one element of the array is not a valid number.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof newValue !== 'number') {
      throw new HttpException(
        'Please, request the valid ids string array. Minimum one element of the array is not a string.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if ((minValue && newValue < minValue) || (maxValue && newValue > maxValue)) {
      throw new HttpException(
        'Please, request the valid ids string array. ' +
        `Min value = ${minValue}, max value = ${maxValue}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return Number(value);
  });
};

const processStringArray = (
  values: string[],
  minLength?: number,
  maxLength?: number,
): string[] => {
  if (!Array.isArray(values)) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  if (values.length === 0) {
    throw new HttpException('Please, request the valid ids array. Array is empty.', HttpStatus.BAD_REQUEST);
  }

  return values.map((value) => {
    if (typeof value !== 'string') {
      throw new HttpException(
        'Please, request the valid ids string array. Minimum one element of the array is not a string.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if ((minLength && value.length < minLength) || (maxLength && value.length > maxLength)) {
      throw new HttpException(
        'Please, request the valid ids string array. ' +
        `Min length = ${minLength}, max length = ${maxLength}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  });
};
