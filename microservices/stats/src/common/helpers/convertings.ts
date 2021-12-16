import { HttpException, HttpStatus } from '@nestjs/common';

export const convertStrToNumberArr = (
  data: string,
  minValue?: number,
  maxValue?: number,
): number[] => {
  let values: number[];

  try {
    values = JSON.parse(data);
  } catch (err) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  if (!Array.isArray(values)) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  if (!values) {
    throw new HttpException('Please, request the valid ids array.', HttpStatus.BAD_REQUEST);
  }

  if (values.length === 0) {
    throw new HttpException('Please, request the valid ids array. Array is empty.', HttpStatus.BAD_REQUEST);
  }

  values.map((value) => {
    if (typeof value !== 'number') {
      throw new HttpException(
        'Please, request the valid ids number array. Minimum one element of the array is not a number.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (value < minValue || value > maxValue) {
      throw new HttpException(
        'Please, request the valid ids string array. ' +
        `Min value = ${minValue}, max value = ${maxValue}.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  });

  return values;
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

  if (!Array.isArray(values)) {
    throw new HttpException('Please, request the valid ids array. It\'s not array.', HttpStatus.BAD_REQUEST);
  }

  if (values.length === 0) {
    throw new HttpException('Please, request the valid ids array. Array is empty.', HttpStatus.BAD_REQUEST);
  }

  values.map((value) => {
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
  });

  return values;
};
