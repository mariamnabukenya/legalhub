# Process Payment Edge Function

## Purpose

This Edge Function is used by the **mobile app** to process payments when users purchase books.

**Note:** This function is NOT used by the website. The website only posts books - all purchases happen in the mobile app.

## Usage

The mobile app calls this function when a user completes a purchase:

```javascript
POST /functions/v1/process-payment
Headers:
  Authorization: Bearer <session_token>
  apikey: <supabase_anon_key>
Body:
{
  "documentId": "uuid",
  "paymentMethod": "mobile_money",
  "amount": 9.99
}
```

## What It Does

1. Validates user authentication
2. Receives payment data (documentId, paymentMethod, amount)
3. Generates payment reference
4. **Processes payment** (integrate with actual payment gateway)
5. Inserts record into `user_purchases` table
6. Increments document downloads count
7. Creates notification
8. Returns success response

## Integration

In production, integrate with actual payment gateways:
- MTN Mobile Money API
- Vodafone Cash API
- AirtelTigo Money API
- Stripe
- Paystack
- Flutterwave

## Deployment

```bash
supabase functions deploy process-payment
```

---

**This function is for mobile app use only.**

