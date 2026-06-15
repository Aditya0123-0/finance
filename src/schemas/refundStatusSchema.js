import * as yup from 'yup';

export const refundStatusSchema = yup.object({
  trackingReference: yup.string().trim().required('Customer ID or tracking reference is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
});
