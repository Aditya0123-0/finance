import * as yup from 'yup';

export const referralSchema = yup.object({
  referrerName: yup.string().trim().required('Your name is required'),
  referrerEmail: yup.string().trim().email('Enter a valid email').required('Your email is required'),
  friendName: yup.string().trim().required('Friend name is required'),
  friendEmail: yup.string().trim().email('Enter a valid email').required('Friend email is required'),
});
