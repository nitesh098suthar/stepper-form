import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mobile } = req.body;

    try {
      await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({ to: `+${mobile}`, channel: 'sms' });

      res.status(200).json({ success: true, message: 'OTP sent' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
  }
}
