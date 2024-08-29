import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'antd';
import FormField from '../FormField';
import { ChildFormProps } from '.';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';

interface FormValues {
  lumpSumOrSIP: boolean;
  amount: number;
  sipType?: boolean;
  sipFrequency?: string;
  annualStepUp?: boolean;
  stepUpPercentage?: number;
  expectedReturn: number;
  investmentPeriod: number;
  swp?: boolean;
  monthlyWithdrawal?: number;
  swpExpectedReturn?: number;
}

const SIP_FREQUENCIES = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annually', value: 'annually' },
];

const LongTermForm: React.FC<ChildFormProps & { schema: AnyObjectSchema }> = ({
  onResult, 
  schema
}) => {
  const defaultValues = {
    lumpSumOrSIP: false,
    expectedReturn : 12,
    investmentPeriod: 15,
    swp: false,
    swpExpectedReturn: 12
  };
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues, 
    resolver: yupResolver(schema)
  });

  const watchSIP = watch('lumpSumOrSIP');
  const watchSipType = watch('sipType');
  const watchSWP = watch('swp');

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onResult([{
      label: "Hello",
      value: 10
    }]);
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <FormField
        name="lumpSumOrSIP"
        control={control}
        type="switch"
        yesLabel='SIP'
        noLabel='LumpSum'
      />

      <FormField
        name="amount"
        control={control}
        type="text"
        label="Amount"
        inputMode="numeric"
        pattern="[0-9]*"
      />

      {watchSIP && (
        <>
          <FormField
            name="sipType"
            control={control}
            type="switch"
            yesLabel="Annual Step Up SIP"
            noLabel="Normal SIP"
          />

          <FormField
            name="sipFrequency"
            control={control}
            type="select"
            label="SIP Frequency"
            options={SIP_FREQUENCIES}
          />

          {watchSipType && (
            <FormField
              name="stepUpPercentage"
              control={control}
              type="text"
              label="% of Step Up"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          )}
        </>
      )}

      <FormField
        name="expectedReturn"
        control={control}
        type="slider"
        label="Annual Expected Return"
        min={1}
        max={30}
      />

      <FormField
        name="investmentPeriod"
        control={control}
        type="slider"
        label="Period of Investment (Years)"
        min={5}
        max={50}
        showPercentage={false}
      />

      <FormField
        name="swp"
        control={control}
        type="switch"
        label="SWP"
      />

      {watchSWP && (
        <>
          <FormField
            name="monthlyWithdrawal"
            control={control}
            type="text"
            label="Monthly Withdrawal"
            inputMode="numeric"
            pattern="[0-9]*"
          />

          <FormField
            name="swpExpectedReturn"
            control={control}
            type="slider"
            label="SWP Annual Expected Return"
            min={1}
            max={30}
          />
        </>
      )}

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default LongTermForm;
