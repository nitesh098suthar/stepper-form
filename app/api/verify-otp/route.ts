import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mobile, otp } = req.body;

    try {
      const verification = await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({ to: `+${mobile}`, code: otp });

      if (verification.status === 'approved') {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: 'Invalid OTP' });
      }
    } catch (error) {
        console.log(error)

      res.status(500).json({ success: false, error: 'Failed to verify OTP' });
    }
  }
}
