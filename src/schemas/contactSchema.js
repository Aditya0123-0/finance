import * as yup from 'yup';

export const contactSchema = yup.object({
  fullName: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: yup.string().trim().required('Phone number is required'),
  serviceInterest: yup.string().trim().required('Please select a service'),
  customServiceDescription: yup.string().when('serviceInterest', {
    is: 'Other',
    then: (schema) => schema.trim().required('Please describe the service you need'),
    otherwise: (schema) => schema.trim(),
  }),
  message: yup.string().trim().required('Message is required'),
});
