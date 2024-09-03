import React from 'react';
import { useController, Control } from 'react-hook-form';
import { Slider, Switch, Select, InputNumber, Input, Form } from 'antd';

const { Option } = Select;

type OptionType = {
  label: string;
  value: string | number;
};

type BaseFormFieldProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label?: string;
  onChange?: (value: string | number | boolean) => void;
  options?: OptionType[];
  showPercentage?: boolean;
  [key: string]: unknown;
};

type SwitchFieldProps = BaseFormFieldProps & {
  type: 'switch';
  yesLabel?: string;
  noLabel?: string;
};

type NonSwitchFieldProps = BaseFormFieldProps & {
  type: 'slider' | 'select' | 'text';
};

type FormFieldProps = SwitchFieldProps | NonSwitchFieldProps;

const FormField: React.FC<FormFieldProps> = ({
  name,
  control,
  type,
  label,
  yesLabel = 'Yes',
  noLabel = 'No',
  onChange,
  options = [],
  showPercentage = true,
  ...rest
}) => {
  const {
    field: { onChange: onFieldChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleChange = (val: string | number | boolean) => {
    onFieldChange(val);
    if (onChange) {
      onChange(val);
    }
  };

  const renderField = () => {
    switch (type) {
      case 'slider':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              {...rest}
              value={value as number}
              onChange={handleChange as (val: number) => void}
              style={{ flex: 1 }}
            />
            <InputNumber
              min={(rest.min as number) ?? 0}
              max={(rest.max as number) ?? 100}
              value={value as number}
              onChange={val => handleChange(val !== null ? val : 0)}
              style={{ marginLeft: 8 }}
              formatter={value => (showPercentage ? `${value}%` : `${value}`)}
              parser={value => (value ? parseFloat(value.replace('%', '')) : 0)}
            />
          </div>
        );
      case 'switch':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>{noLabel as string}</span>
            <Switch
              {...rest}
              checked={value as boolean}
              onChange={handleChange as (val: boolean) => void}
            />
            <span style={{ marginLeft: 8 }}>{yesLabel as string}</span>
          </div>
        );
      case 'select':
        return (
          <Select
            {...rest}
            value={value as string | number}
            onChange={handleChange}
          >
            {options.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      case 'text':
      default:
        return (
          <Input
            {...rest}
            value={value as string}
            onChange={e => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <Form.Item
      label={label}
      help={error?.message}
      validateStatus={error ? 'error' : ''}
    >
      {renderField()}
    </Form.Item>
  );
};

export default FormField;
