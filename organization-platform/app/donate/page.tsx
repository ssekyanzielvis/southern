'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, generateReceiptNumber } from '@/lib/utils';

const donationSchema = z.object({
  donor_name: z.string().min(2, 'Name must be at least 2 characters'),
  donor_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  donor_phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  amount: z.number().min(1000, 'Minimum donation amount is UGX 1,000'),
  payment_method: z.enum(['mtn', 'airtel', 'card', 'manual']),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface PaymentSettings {
  mobile_money_number: string | null;
  mobile_money_name: string | null;
  mobile_money_network: string | null;
}

export default function DonatePage() {
  const [submitting, setSubmitting] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const showNotification = useAppStore((state) => state.showNotification);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      payment_method: 'manual',
    },
  });

  const paymentMethod = watch('payment_method');

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data } = await supabase
        .from('payment_settings')
        .select('*')
        .single();
      
      if (data) {
        setPaymentSettings(data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const onSubmit = async (data: DonationFormData) => {
    setSubmitting(true);
    try {
      const receiptNumber = generateReceiptNumber();
      
      const { error } = await supabase.from('donations').insert([
        {
          ...data,
          payment_reference: receiptNumber,
          receipt_generated: data.payment_method !== 'manual',
        },
      ]);

      if (error) throw error;

      showNotification(
        `Thank you for your donation of ${formatCurrency(data.amount)}! Reference: ${receiptNumber}`,
        'success'
      );
      reset();
    } catch (error) {
      console.error('Error processing donation:', error);
      showNotification('Failed to process donation. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Make a Donation</h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Your generosity helps us continue our mission to create positive change in the community.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Direct Impact</h3>
            <p className="text-gray-700">Your donation directly supports our programs and initiatives.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Payment</h3>
            <p className="text-gray-700">Multiple payment options for your convenience.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-700">All transactions are secure and confidential.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Donor Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donor_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('donor_name')}
                    type="text"
                    id="donor_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.donor_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.donor_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="donor_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register('donor_phone')}
                    type="tel"
                    id="donor_phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+256 700 000000"
                  />
                  {errors.donor_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.donor_phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="donor_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    {...register('donor_email')}
                    type="email"
                    id="donor_email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                  {errors.donor_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.donor_email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (UGX) *
              </label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                id="amount"
                min="1000"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10000"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="mtn"
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">MTN Mobile Money</p>
                    <p className="text-sm text-gray-600">Pay via MTN</p>
                  </div>
                </label>

                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="airtel"
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Airtel Money</p>
                    <p className="text-sm text-gray-600">Pay via Airtel</p>
                  </div>
                </label>

                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="card"
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Pay with card</p>
                  </div>
                </label>

                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register('payment_method')}
                    type="radio"
                    value="manual"
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Direct Transfer</p>
                    <p className="text-sm text-gray-600">Send directly to number</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Manual Payment Instructions */}
            {paymentMethod === 'manual' && paymentSettings?.mobile_money_number && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Payment Instructions</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Please send your donation to:
                </p>
                <p className="text-sm font-semibold">
                  {paymentSettings.mobile_money_network}: {paymentSettings.mobile_money_number}
                </p>
                <p className="text-sm text-gray-700">
                  Name: {paymentSettings.mobile_money_name}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  After payment, submit this form to record your donation.
                </p>
              </div>
            )}

            {/* Payment Method Instructions */}
            {paymentMethod !== 'manual' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  After submitting, you will receive payment instructions to complete your donation.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>Complete Donation</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Your donation is tax-deductible to the extent allowed by law. You will receive a receipt via email.
          </p>
        </div>
      </div>
    </div>
  );
}
