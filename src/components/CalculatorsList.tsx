import { Row } from 'antd';
import data from '../data/list_of_calculators.json';
import CalculatorLink , { IconKeys } from './CalculatorLink';

const Calculators: React.FC = () => (
  <Row gutter={[16, 24]}>
    {data.map(calculator => (
      <CalculatorLink
        key={calculator.id}
        title={calculator.name}
        description={calculator.description}
        link={calculator.link}
        icon={calculator.icon as IconKeys}
      />
    ))}
  </Row>
);

export default Calculators;
