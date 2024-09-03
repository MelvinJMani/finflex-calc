import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'antd';
import FormField from '../FormField';
import { ChildFormProps } from '.';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';
import {
  calculateTotalInvestment,
  calculateTax,
  calculateExpenseRatio,
  calculateSIPReturn,
  adjustAmount
} from '../../utils';
import { ResultDataItem } from '../../views/calculator';

interface FormValues {
  amount: number;
  expectedReturn: number;
  sipFrequency?: string;
  investmentPeriod: number;
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

const SIPForm: React.FC<ChildFormProps & { schema: AnyObjectSchema }> = ({
  schema,
  onResult
}) => {
  const defaultValues = {
    amount: 25000,
    expectedReturn: 12,
    sipFrequency: 'monthly',
    investmentPeriod: 10,
    advanceOptions: false,
  };
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    const {
      amount,
      sipFrequency = 'monthly',
      investmentPeriod,
      expectedReturn,
      advanceOptions = false,
      taxRate = 0,
      inflationRate = 0,
      expenseRatio = 0,
    } = data;
    const result: ResultDataItem[] = [];
    const invested = calculateTotalInvestment(
      amount,
      investmentPeriod,
      sipFrequency,
    );
    const estimatedReturn = calculateSIPReturn(
      amount,
      investmentPeriod,
      expectedReturn,
      sipFrequency,
    );
    result.push({
      value: Math.round(invested ?? 0),
      label: 'Total Investment',
    });
    result.push({
      value: Math.round(estimatedReturn ?? 0),
      label: 'Estimated Return',
    });
    const totalValue = Math.round(estimatedReturn ?? 0) + Math.round(invested ?? 0);
    result.push({
      value: totalValue,
      label: 'Total Value',
    });
    if (advanceOptions) {
      const taxAmount = calculateTax(totalValue, taxRate);
      result.push({
        value: taxAmount,
        label: 'Tax Calculated',
      });
      const expenseRatioValue = calculateExpenseRatio(totalValue, expenseRatio);
      result.push({
        value: expenseRatioValue,
        label: 'Expense Ratio Calculated',
      });
      const adjustedFinalValue = adjustAmount(
        totalValue,
        inflationRate,
        expenseRatio,
        taxRate,
      );
      result.push({
        value: adjustedFinalValue,
        label: 'Final Value (After tax & expense ratio, adjusted to inflation)',
      });
    }
    onResult(result);
  };

  const watchAdvanceOptions = watch('advanceOptions');

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <FormField
        name="amount"
        control={control}
        type="text"
        label="SIP Amount"
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <FormField
        name="sipFrequency"
        control={control}
        type="select"
        label="SIP Frequency"
        options={FREQUENCIES}
      />
      
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

      <FormField
        name="advanceOptions"
        control={control}
        type="switch"
        label="Advanced Options"
      />

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
            step={0.1}
          />
          <FormField
            name="expenseRatio"
            control={control}
            type="slider"
            label="Expense Ratio (%)"
            min={0}
            max={5}
            step={0.1}
          />
        </>
      )}
      <Button type="primary" htmlType="submit">
        Calculate
      </Button>
    </Form>
  );
};

export default SIPForm;
