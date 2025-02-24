import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaypalService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly basePaypalUrl: string;
  private readonly baseFrontUrl: string;
  private readonly successPath: string;
  private readonly cancelPath: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    this.basePaypalUrl =
      this.configService.get<string>('PAYPAL_API') ||
      'https://api-m.sandbox.paypal.com';
    this.baseFrontUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.successPath =
      this.configService.get<string>('PAYPAL_SUCCESS_PATH') || '/success';
    this.cancelPath =
      this.configService.get<string>('PAYPAL_CANCEL_PATH') || '/cancel';

    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal credentials not found in environment variables');
    }
  }

  private async getPaypalAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );

    const response = await axios.post(
      `${this.basePaypalUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (response.status !== 200) {
      throw new HttpException(
        'Failed to authenticate with PayPal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.data.access_token;
  }

  async createPaypalOrder(
    total: number,
    currency: string = 'EUR',
  ): Promise<any> {
    const accessToken = await this.getPaypalAccessToken();

    const response = await axios.post(
      `${this.basePaypalUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        application_context: {
          return_url: `${this.baseFrontUrl}${this.successPath}`,
          cancel_url: `${this.baseFrontUrl}${this.cancelPath}`,
        },
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: total,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 201) {
      throw new HttpException(
        'Failed to create PayPal order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.data;
  }

  async capturePaypalOrder(paypalOrderId: string): Promise<any> {
    const accessToken = await this.getPaypalAccessToken();

    const response = await axios.post(
      `${this.basePaypalUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 201) {
      throw new HttpException(
        'Failed to capture PayPal order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.data;
  }
}
