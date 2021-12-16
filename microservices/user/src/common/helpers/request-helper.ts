import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import * as qs from 'querystring';
import { ResponseLoginDto } from '../../user/dto/response-login.dto';
import { Env } from '../dictionary/env';

export class RequestHelperDto<T> {
  constructor(
    public protocol: string,
    public service: string,
    public url: string,
    public method: Method,
    public params: T,
  ) {}
}

export class RequestHelper {
  private authToken: string;
  private depth: number = 1;

  constructor() {
    this.getAuthToken();
  }

  private async getAuthToken(): Promise<void> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
      const authData: ResponseLoginDto = await this.request<string, ResponseLoginDto>(
        new RequestHelperDto(
          'http',
          Env.SERVICE_AUTH,
          'login',
          'post',
          qs.stringify({ login: Env.USER_SERVICE_LOGIN, password: Env.USER_SERVICE_PASSWORD }),
        ),
      );

      if (!authData.response?.token) {
        throw new HttpException('', HttpStatus.UNAUTHORIZED);
      }

      this.authToken = authData.response.token;
    } catch (err) {
      throw new HttpException('Cannot Authorize Service', HttpStatus.UNAUTHORIZED);
    }
  }

  public async request<RequestDto, ResponseDto>(
    data: RequestHelperDto<RequestDto>,
  ): Promise<ResponseDto> {
    try {
      const config: AxiosRequestConfig = {
        url: `${data.protocol}://${data.service}/${data.url}`,
        method: data.method,
        headers: {
          Accept: '*/*',
          Connection: 'keep-alive',
          Authorization: `Bearer ${this.authToken}`,
          ['Content-Type']:
            data.service === Env.SERVICE_AUTH
              ? 'application/x-www-form-urlencoded'
              : 'application/json',
        },
      };

      config[
        `${
          data.method === 'get'
            ? 'params'
            : 'data'
        }`
      ] = data.params;

      const { data: response }: AxiosResponse<ResponseDto> = await axios(
        config,
      );

      this.depth = 1;

      return response;
    } catch (err) {
      if (err.response?.data?.statusCode === HttpStatus.UNAUTHORIZED) {
        await this.getAuthToken();

        if (this.depth >= 2) {
          this.depth = 1;

          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        this.depth++;

        return await this.request(data);
      }

      throw new HttpException(
        err.response?.data?.message || err.response?.statusText || err.response,
        err.response?.data?.statusCode || err.response?.status || err.status,
      );
    }
  }
}
