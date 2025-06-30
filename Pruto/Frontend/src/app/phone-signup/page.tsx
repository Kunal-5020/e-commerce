// app/phone-signup/page.tsx
"use client";
import { useState } from 'react';

export default function PhoneSignupPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      setMessage('Phone number verified');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={step === 1 ? sendOTP : verifyOTP} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Phone Signup</h2>
        {step === 1 ? (
          <>
            <input
              type="tel"
              required
              placeholder="+91xxxxxxxxxx"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              required
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Verify OTP
            </button>
          </>
        )}
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
