import { useParams } from 'react-router-dom';
import { getCalculatorByName } from '../utils';
import { Button, Flex, Divider, Typography, Tooltip } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import FavoriteButton from '../components/FavoriteButton';

const { Title, Paragraph } = Typography;

const boxStyle: React.CSSProperties = {
  width: '100%',
  height: 50,
};

const Calculator: React.FC = () => {
  const { name = '' } = useParams();
  const calculator = getCalculatorByName(name);

  return (
    <>
      <Flex gap="middle" vertical={false} style={boxStyle} justify="flex-start" align="center">
        <Tooltip title="Go back" color="#001529">
          <Button icon={<RollbackOutlined />} type="dashed" href='/'/>
        </Tooltip>
        <Title level={2}>{`${calculator?.name} Calculator`}</Title>
        <FavoriteButton name={name} />
      </Flex>
      <Divider />
      <Paragraph>
        <blockquote>{calculator?.description ?? ''}</blockquote>
      </Paragraph>
    </>
  );
};

export default Calculator;
