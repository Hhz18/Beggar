/**
 * Payment Engine
 * Handles Payment Request API integration
 */

// Payment Request API interfaces
export interface PaymentMethodData {
  supportedMethods: string;
  data?: any;
}

export interface PaymentCurrencyAmount {
  currency: string;
  value: string;
}

export interface PaymentItem {
  label: string;
  amount: PaymentCurrencyAmount;
  pending?: boolean;
}

export interface PaymentOptions {
  requestPayerName?: boolean;
  requestPayerEmail?: boolean;
  requestPayerPhone?: boolean;
  requestBillingAddress?: boolean;
  requestShipping?: boolean;
  shippingType?: 'shipping' | 'delivery' | 'pickup';
}

export interface PaymentRequestOptions {
  paymentMethods: PaymentMethodData[];
  total: PaymentItem;
  displayItems?: PaymentItem[];
  options?: PaymentOptions;
}

export interface PaymentResult {
  methodName: string;
  details: any;
  payerName?: string;
  payerEmail?: string;
  payerPhone?: string;
  shippingAddress?: any;
  shippingOption?: string;
}

// Payment Engine class
class PaymentEngine {
  private request: PaymentRequest | null = null;

  /**
   * Check if Payment Request API is supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'PaymentRequest' in window;
  }

  /**
   * Get supported payment methods
   */
  getSupportedPaymentMethods(): PaymentMethodData[] {
    // Basic payment methods - in production, you'd configure these based on your payment processor
    return [
      {
        supportedMethods: 'https://apple.com/apple-pay',
        data: {
          supportedNetworks: ['visa', 'masterCard'],
          countryCode: 'CN',
          currencyCode: 'CNY',
        },
      },
      {
        supportedMethods: 'https://google.com/pay',
        data: {
          environment: 'TEST',
          apiVersion: 2,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['VISA', 'MASTERCARD'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'example_gateway_merchant_id',
                },
              },
            },
          ],
        },
      },
    ];
  }

  /**
   * Check if user can make payment
   */
  async canMakePayment(paymentMethods: PaymentMethodData[]): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const request = new PaymentRequest(paymentMethods, {
        total: {
          label: 'Test',
          amount: { currency: 'CNY', value: '0.01' },
        },
      });

      return await request.canMakePayment();
    } catch {
      return false;
    }
  }

  /**
   * Validate payment amount
   */
  validateAmount(amount: number): boolean {
    return (
      typeof amount === 'number' &&
      amount > 0 &&
      amount <= 1000000 &&
      Number.isFinite(amount)
    );
  }

  /**
   * Create a payment request
   */
  createPaymentRequest(options: PaymentRequestOptions): PaymentRequest | null {
    if (!this.isSupported()) {
      return null;
    }

    try {
      this.request = new PaymentRequest(
        options.paymentMethods,
        {
          total: options.total,
          displayItems: options.displayItems,
        },
        options.options
      );

      return this.request;
    } catch (error) {
      console.error('Failed to create payment request:', error);
      return null;
    }
  }

  /**
   * Show payment interface
   */
  async show(): Promise<PaymentResponse | null> {
    if (!this.request) {
      return null;
    }

    try {
      const response = await this.request.show();
      return response;
    } catch (error) {
      // User cancelled or error occurred
      console.error('Payment request failed:', error);
      return null;
    }
  }

  /**
   * Extract payment information from response
   */
  extractPaymentInfo(response: PaymentResponse): PaymentResult {
    return {
      methodName: response.methodName,
      details: response.details,
      payerName: response.payerName?.toString(),
      payerEmail: response.payerEmail?.toString(),
      payerPhone: response.payerPhone?.toString(),
      shippingAddress: response.shippingAddress,
      shippingOption: response.shippingOption,
    };
  }

  /**
   * Complete payment
   */
  async completePayment(
    response: PaymentResponse,
    status: 'success' | 'fail' | 'unknown'
  ): Promise<void> {
    try {
      await response.complete(status);
    } catch (error) {
      console.error('Failed to complete payment:', error);
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'CNY'): string {
    try {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }
}

// Export singleton instance
export const paymentEngine = new PaymentEngine();
