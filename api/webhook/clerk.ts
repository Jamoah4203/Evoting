import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'node:stream/consumers';
import { Webhook } from 'svix';
import { getSupabaseAdmin } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: false, // Required to read raw body for webhook verification
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ message: 'Missing webhook headers' });
  }

  const rawBody = await buffer(req);
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let event;
  try {
    event = webhook.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { type, data } = event;
  const supabase = getSupabaseAdmin();

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        public_metadata,
        verification,
      } = data;

      const email = email_addresses?.[0]?.email_address || '';
      const voter_id = public_metadata?.voter_id || '';
      const role = public_metadata?.role || 'voter';
      const is_verified = verification?.status === 'verified';

      const { error } = await supabase.from('users').upsert({
        id,
        email,
        voter_id,
        first_name,
        last_name,
        role,
        is_verified,
      });

      if (error) {
        console.error('Supabase upsert error:', error.message);
        return res.status(500).json({ message: 'Supabase insert error' });
      }
    }

    return res.status(200).json({ message: 'Webhook handled successfully' });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
