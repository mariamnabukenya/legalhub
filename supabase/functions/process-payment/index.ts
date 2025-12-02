import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { documentId, paymentMethod, amount } = await req.json();

    if (!documentId || !paymentMethod || !amount) {
      throw new Error('Missing required fields');
    }

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // In a real implementation, you would integrate with:
    // - Mobile Money API (MTN, Vodafone, AirtelTigo)
    // - Paystack API
    // - Flutterwave API
    
    // For now, we'll simulate a successful payment
    const paymentSuccess = true;

    if (paymentSuccess) {
      // Record the purchase
      const { data: purchase, error: purchaseError } = await supabaseClient
        .from('user_purchases')
        .insert({
          user_id: user.id,
          document_id: documentId,
          amount_paid: amount,
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Update document downloads count
      const { error: updateError } = await supabaseClient.rpc('increment_downloads', {
        doc_id: documentId,
      });

      if (updateError) console.error('Error updating downloads:', updateError);

      // Create notification
      await supabaseClient.from('notifications').insert({
        user_id: user.id,
        title: 'Purchase Successful',
        message: `Your payment of GHS ${amount} was successful. Document is now available in your library.`,
        type: 'payment',
        is_read: false,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment processed successfully',
          purchase,
          paymentReference,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
