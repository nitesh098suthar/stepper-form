'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface MobileFormData {
  mobile: string;
}

interface OTPFormData {
  otp: string;
}

interface UserDetailsFormData {
  name: string;
  email?: string;
  password: string;
}

const SignupStepper = () => {
  const [step, setStep] = useState<number>(1);
  const [mobile, setMobile] = useState<string>('');
  const { register, handleSubmit, setError } = useForm<MobileFormData | OTPFormData | UserDetailsFormData>();

  // Send OTP
  const sendOTP: SubmitHandler<MobileFormData> = async (data) => {
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMobile(data.mobile);
        setStep(2);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify OTP
  const verifyOTP: SubmitHandler<OTPFormData> = async (data) => {
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: data.otp }),
      });

      if (res.ok) {
        setStep(3);
      } else {
        setError('otp', { message: 'Invalid OTP' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create User
  const createUser: SubmitHandler<UserDetailsFormData> = async (data) => {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mobile }),
      });

      if (res.ok) alert('Signup successful!');
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamically choose the correct submit handler based on step
  const handleFormSubmit = (data: MobileFormData | OTPFormData | UserDetailsFormData) => {
    if (step === 1) {
      sendOTP(data as MobileFormData);
    } else if (step === 2) {
      verifyOTP(data as OTPFormData);
    } else if (step === 3) {
      createUser(data as UserDetailsFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {step === 1 && (
        <>
          <input {...register('mobile', { required: true })} placeholder="Mobile Number" />
          <button type="submit">Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <input {...register('otp', { required: true })} placeholder="Enter OTP" />
          <button type="submit">Verify OTP</button>
          <button type="button" onClick={() => setStep(1)}>Previous</button>
        </>
      )}
      {step === 3 && (
        <>
          <input {...register('name', { required: true })} placeholder="Name" />
          <input {...register('email')} placeholder="Email (Optional)" />
          <input disabled value={mobile} />
          <input {...register('password', { required: true })} placeholder="Password" type="password" />
          <button type="submit">Signup</button>
        </>
      )}
    </form>
  );
};

export default SignupStepper;
