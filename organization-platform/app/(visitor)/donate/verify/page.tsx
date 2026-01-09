'export const dynamic = "force-dynamic";'
'export const dynamic = "force-dynamic";'
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const transactionId = searchParams.get('transaction_id');
      const txRef = searchParams.get('tx_ref');
      const status = searchParams.get('status');

      if (!transactionId) {
        setStatus('failed');
        setMessage('Invalid payment verification link');
        return;
      }

      // If status is already cancelled/failed
      if (status === 'cancelled' || status === 'failed') {
        setStatus('failed');
        setMessage('Payment was cancelled or failed. Please try again.');
        return;
      }

      // Verify with backend
      const response = await fetch('/api/payments/card/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, txRef }),
      });

      const result = await response.json();

      if (result.success && result.status === 'success') {
        setStatus('success');
        setMessage('Payment successful! Thank you for your donation.');
        setTransactionDetails(result);
        
        // Redirect to home after 5 seconds
        setTimeout(() => {
          router.push('/');
        }, 5000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support if amount was deducted.');
        setTransactionDetails(result);
      }

    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
      setMessage('An error occurred during verification. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <LoadingSpinner size="lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Payment
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              {transactionDetails && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-green-700">
                        {transactionDetails.currency} {transactionDetails.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-semibold">{transactionDetails.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-xs">{transactionDetails.transactionId}</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Redirecting to home page in 5 seconds...
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              {transactionDetails?.reference && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700">
                    Reference: <span className="font-semibold">{transactionDetails.reference}</span>
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/donate')}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
