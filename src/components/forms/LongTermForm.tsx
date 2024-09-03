import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'antd';
import FormField from '../FormField';
import { ChildFormProps } from '.';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';
import { ResultDataItem } from '../../views/calculator';
import { getInvestmentType, InvestmentType, calculateTotalInvestment, calculateTotalInvestmentWithStepUp } from '../../utils';

interface FormValues {
  isSIP: boolean;
  amount: number;
  isStepUpSIP?: boolean;
  sipFrequency?: string;
  annualStepUp?: boolean;
  stepUpPercentage?: number;
  expectedReturn: number;
  investmentPeriod: number;
  swp?: boolean;
  monthlyWithdrawal?: number;
  swpExpectedReturn?: number;
  advanceOptions?: boolean;
  taxRate?: number; 
  inflationRate?: number; 
  expenseRatio?: number;
}

const FREQUENCIES = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annually', value: 'annually' },
];

const LongTermForm: React.FC<ChildFormProps & { schema: AnyObjectSchema }> = ({
  schema,
  onResult
}) => {
  const defaultValues = {
    isSIP: false,
    expectedReturn: 12,
    investmentPeriod: 15,
    swp: false,
    swpExpectedReturn: 12,
    advanceOptions: false
  };
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchSIP = watch('isSIP');
  const watchSipType = watch('isStepUpSIP');
  const watchSWP = watch('swp');  
  const watchAdvanceOptions = watch('advanceOptions');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data: FormValues) => {
    const { amount, isSIP, isStepUpSIP, sipFrequency = "monthly", investmentPeriod, stepUpPercentage = 0 } = data;
    const result: ResultDataItem[] = [];
    const investmentType:InvestmentType = getInvestmentType(isSIP, isStepUpSIP ?? false);
    //Total Amount
    let totalAmount ;
    if(investmentType === InvestmentType.LUMPSUM){
      totalAmount = amount ?? 0;
    }else if(investmentType === InvestmentType.SIP) {
      totalAmount = calculateTotalInvestment(amount, investmentPeriod ,  sipFrequency);
    }else if (investmentType === InvestmentType.STEPUP_SIP){
      totalAmount = calculateTotalInvestmentWithStepUp(amount, investmentPeriod, sipFrequency, stepUpPercentage);
    }
    result.push({
      value: Math.round(totalAmount ?? 0), 
      label: "Total Investment"
    });
    onResult(result);
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <FormField
        name="isSIP"
        control={control}
        type="switch"
        yesLabel="SIP"
        noLabel="LumpSum"
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
            name="isStepUpSIP"
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
            options={FREQUENCIES}
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
        min={1}
        max={50}
        showPercentage={false}
      />

      <FormField name="swp" control={control} type="switch" label="SWP" />

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

          <FormField
            name="swpFrequency"
            control={control}
            type="select"
            label="SWP Frequency"
            options={FREQUENCIES}
          />

        </>
      )}

      <FormField name="advanceOptions" control={control} type="switch" label="Advanced Options" />

      {watchAdvanceOptions && (
        <> 
          <FormField
            name="taxRate"
            control={control}
            type="slider"
            label="Rate of Tax (%)"
            min={0}
            max={20}
          />
          <FormField
            name="inflationRate"
            control={control}
            type="slider"
            label="Rate of Inflation (%)"
            min={0}
            max={10}
            step={.1}
          />
          <FormField
            name="expenseRatio"
            control={control}
            type="slider"
            label="Expense Ratio (%)"
            min={0}
            max={5}
            step={.1}
          />
        </>
      )}

      <Button type="primary" htmlType="submit">
        Calculate
      </Button>
    </Form>
  );
};

export default LongTermForm;
