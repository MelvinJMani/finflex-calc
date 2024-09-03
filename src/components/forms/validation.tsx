import * as yup from 'yup';

const longTermSchema = yup.object().shape({
  lumpSumOrSIP: yup.boolean(),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(1, 'Amount must be at least 1'),
  sipType: yup.boolean(),
  sipFrequency: yup.string().when('lumpSumOrSIP', ([lumpSumOrSIP], schema) => {
    return lumpSumOrSIP
      ? schema.required('SIP Frequency is required')
      : schema.notRequired();
  }),
  annualStepUp: yup.boolean(),
  stepUpPercentage: yup.number().when('sipType', ([sipType], schema) => {
    return sipType
      ? schema
          .typeError('Step Up Percentage must be a number')
          .required('Step Up Percentage is required')
          .min(1, 'Step Up Percentage must be at least 1')
          .max(100, 'Step Up Percentage cannot exceed 100')
      : schema.notRequired();
  }),
  expectedReturn: yup
    .number()
    .typeError('Expected Return must be a number')
    .required('Expected Return is required')
    .min(1, 'Expected Return must be at least 1')
    .max(30, 'Expected Return cannot exceed 30'),
  investmentPeriod: yup
    .number()
    .typeError('Investment Period must be a number')
    .required('Investment Period is required')
    .min(1, 'Investment Period must be at least 1 years')
    .max(50, 'Investment Period cannot exceed 50 years'),
  swp: yup.boolean(),
  monthlyWithdrawal: yup.number().when('swp', ([swp], schema) => {
    return swp
      ? schema
          .typeError('Monthly Withdrawal must be a number')
          .required('Monthly Withdrawal is required')
          .min(1, 'Monthly Withdrawal must be at least 1')
      : schema.notRequired();
  }),
  swpExpectedReturn: yup.number().when('swp', ([swp], schema) => {
    return swp
      ? schema
          .typeError('SWP Expected Return must be a number')
          .required('SWP Expected Return is required')
          .min(1, 'SWP Expected Return must be at least 1')
          .max(30, 'SWP Expected Return cannot exceed 30')
      : schema.notRequired();
  }),
});

const schemaMap: Record<string, yup.AnyObjectSchema> = {
  long_term: longTermSchema,
};

export default schemaMap;
