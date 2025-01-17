import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'antd';
import FormField from '../FormField';
import { ChildFormProps } from '.';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';
import { ResultDataItem } from '../../views/calculator';
import {
  getInvestmentType,
  InvestmentType,
  calculateTotalInvestment,
  calculateTotalInvestmentWithStepUp,
  calculateLumpsumReturnAmount,
  calculateTax,
  calculateExpenseRatio,
  calculateSIPReturn,
  calculateSIPReturnWithStepUp,
  adjustAmount,
  calculateSWPReturn,
} from '../../utils';

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
  withdrawal?: number;
  swpExpectedReturn?: number;
  advanceOptions?: boolean;
  taxRate?: number;
  inflationRate?: number;
  expenseRatio?: number;
  swpFrequency?: string;
  swpPeriod?: number;
}

const FREQUENCIES = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annually', value: 'annually' },
];

const LongTermForm: React.FC<ChildFormProps & { schema: AnyObjectSchema }> = ({
  schema,
  onResult,
}) => {
  const defaultValues = {
    amount: 25000,
    isSIP: false,
    expectedReturn: 12,
    investmentPeriod: 10,
    sipFrequency: 'monthly',
    swp: false,
    advanceOptions: false,
    swpExpectedReturn: 12,
    swpPeriod: 10,
    swpFrequency: 'monthly',
    withdrawal: 10000,
  };

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchSIP = watch('isSIP');
  const watchSipType = watch('isStepUpSIP');
  const watchSWP = watch('swp');
  const watchAdvanceOptions = watch('advanceOptions');

  const onSubmit = (data: FormValues) => {
    const {
      amount,
      isSIP,
      isStepUpSIP,
      sipFrequency = 'monthly',
      investmentPeriod,
      stepUpPercentage = 0,
      expectedReturn,
      advanceOptions = false,
      taxRate = 0,
      inflationRate = 0,
      expenseRatio = 0,
      swp = false,
      swpExpectedReturn = 0,
      swpPeriod = 0,
      swpFrequency = 'monthly',
      withdrawal = 0,
    } = data;
    const result: ResultDataItem[] = [];
    const investmentType: InvestmentType = getInvestmentType(
      isSIP,
      isStepUpSIP ?? false,
    );
    let invested,
      estimatedReturn,
      taxAmount,
      expenseRatioValue,
      adjustedFinalValue;
    if (investmentType === InvestmentType.LUMPSUM) {
      invested = amount ?? 0;
      estimatedReturn = calculateLumpsumReturnAmount(
        amount,
        investmentPeriod,
        expectedReturn,
      );
    } else if (investmentType === InvestmentType.SIP) {
      invested = calculateTotalInvestment(
        amount,
        investmentPeriod,
        sipFrequency,
      );
      estimatedReturn = calculateSIPReturn(
        amount,
        investmentPeriod,
        expectedReturn,
        sipFrequency,
      );
    } else if (investmentType === InvestmentType.STEPUP_SIP) {
      invested = calculateTotalInvestmentWithStepUp(
        amount,
        investmentPeriod,
        sipFrequency,
        stepUpPercentage,
      );
      estimatedReturn = calculateSIPReturnWithStepUp(
        amount,
        investmentPeriod,
        expectedReturn,
        sipFrequency,
        stepUpPercentage,
      );
    }
    result.push({
      value: Math.round(invested ?? 0),
      label: 'Total Investment',
    });
    result.push({
      value: Math.round(estimatedReturn ?? 0),
      label: 'Estimated Return',
    });
    const totalValue =
      Math.round(estimatedReturn ?? 0) + Math.round(invested ?? 0);
    result.push({
      value: totalValue,
      label: 'Total Value',
    });
    if (advanceOptions) {
      taxAmount = calculateTax(totalValue, taxRate);
      result.push({
        value: taxAmount,
        label: 'Tax Calculated',
      });
      expenseRatioValue = calculateExpenseRatio(totalValue, expenseRatio);
      result.push({
        value: expenseRatioValue,
        label: 'Expense Ratio Calculated',
      });
      adjustedFinalValue = adjustAmount(
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
    //If SWP is enabled
    if (swp) {
      const amount = (advanceOptions ? adjustedFinalValue : totalValue) ?? 0;
      const { remainingBalance = 0, totalWithdrawn = 0 } = calculateSWPReturn(
        amount,
        withdrawal,
        swpPeriod,
        swpExpectedReturn,
        swpFrequency,
      );
      result.push({
        value: totalWithdrawn,
        label: 'Total Withdrawal',
      });
      result.push({
        value: remainingBalance,
        label: 'Final Value after withdrawal',
      });
    }
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
            name="withdrawal"
            control={control}
            type="text"
            label="Withdrawal"
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

          <FormField
            name="swpPeriod"
            control={control}
            type="slider"
            label="Period of SWP (Years)"
            min={1}
            max={50}
            showPercentage={false}
          />
        </>
      )}

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

export default LongTermForm;
