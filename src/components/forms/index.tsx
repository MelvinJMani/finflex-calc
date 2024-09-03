import LongTermForm from './LongTermForm';
import { ResultDataItem } from '../../views/calculator';
import schemaMap from './validation';
import { AnyObjectSchema } from 'yup';

export type ChildFormProps = {
  onResult: (data: ResultDataItem[]) => void;
};

type MainFormProps = {
  form: string;
};

type FormProps = MainFormProps & ChildFormProps;

type FormComponentProps = ChildFormProps & { schema: AnyObjectSchema };

const formMap: Record<string, React.FC<FormComponentProps>> = {
  long_term: LongTermForm,
};

const DynamicFormLoader: React.FC<FormProps> = ({ form, onResult }) => {
  const FormComponent = formMap[form];
  const schema = schemaMap[form];

  if (!FormComponent) {
    return <div>Form not found</div>;
  }

  return <FormComponent onResult={onResult} schema={schema} />;
};

export default DynamicFormLoader;
