import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDB();

    const { name, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = new User({ name, email, mobile, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.log(error)

      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }
}
