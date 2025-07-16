import Paystack from "paystack";
import crypto from "crypto";

// Initialize Paystack with your secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

class PaystackService {
  /**
   * Initialize a transaction
   * @param {Object} params - Transaction parameters
   * @param {string} params.email - Customer email
   * @param {number} params.amount - Amount in kobo (₦1 = 100 kobo)
   * @param {string} params.reference - Unique transaction reference
   * @param {string} params.callback_url - URL to redirect after payment
   * @param {Object} params.metadata - Additional data
   * @returns {Promise<Object>} Transaction initialization response
   */
  async initializeTransaction({
    email,
    amount,
    reference,
    callback_url,
    metadata = {},
  }) {
    try {
      const response = await paystack.transaction.initialize({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        reference,
        callback_url,
        metadata: {
          ...metadata,
          cancel_action: callback_url,
        },
      });

      if (response.status) {
        return {
          success: true,
          data: response.data,
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code,
          reference: response.data.reference,
        };
      } else {
        throw new Error(
          response.message || "Transaction initialization failed"
        );
      }
    } catch (error) {
      console.error("Paystack initialization error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify a transaction
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Verification response
   */
  async verifyTransaction(reference) {
    try {
      const response = await paystack.transaction.verify(reference);

      if (response.status) {
        const { data } = response;
        return {
          success: true,
          data: {
            reference: data.reference,
            amount: data.amount / 100, // Convert from kobo to naira
            status: data.status,
            gateway_response: data.gateway_response,
            paid_at: data.paid_at,
            created_at: data.created_at,
            channel: data.channel,
            currency: data.currency,
            ip_address: data.ip_address,
            metadata: data.metadata,
            customer: data.customer,
          },
        };
      } else {
        throw new Error(response.message || "Transaction verification failed");
      }
    } catch (error) {
      console.error("Paystack verification error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify Paystack webhook signature
   * @param {string} payload - Request body as string
   * @param {string} signature - Paystack signature from headers
   * @returns {boolean} True if signature is valid
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest("hex");

      return hash === signature;
    } catch (error) {
      console.error("Webhook signature verification error:", error);
      return false;
    }
  }

  /**
   * Generate a unique transaction reference
   * @param {string} prefix - Optional prefix for reference
   * @returns {string} Unique reference
   */
  generateReference(prefix = "BL") {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Calculate VAT (7.5% for Nigeria)
   * @param {number} amount - Amount before VAT
   * @returns {Object} VAT calculation breakdown
   */
  calculateVAT(amount) {
    const VAT_RATE = 0.075; // 7.5%
    const vat = amount * VAT_RATE;
    const total = amount + vat;

    return {
      subtotal: amount,
      vat: Math.round(vat * 100) / 100, // Round to 2 decimal places
      total: Math.round(total * 100) / 100,
    };
  }
}

export default new PaystackService();
