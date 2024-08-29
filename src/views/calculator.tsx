import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculatorByName, isFavorite, toggleFavorite } from '../utils';
import { Button, Flex, Divider, Typography, Tooltip } from 'antd';
import { RollbackOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const boxStyle: React.CSSProperties = {
  width: '100%',
  height: 50,
};

const Calculator: React.FC = () => {
  const { name = '' } = useParams();
  const calculator = getCalculatorByName(name);
  const [favorite, setFavorite] = useState<boolean>(isFavorite(name));

  const handleToggleFavorite = () => {
    toggleFavorite(name);
    setFavorite(isFavorite(name));  // Update the state based on the current favorite status
  };

  return (
    <>
      <Flex gap="middle" vertical={false} style={boxStyle} justify="flex-start" align="center">
        <Tooltip title="Go back" color="#001529">
          <Button icon={<RollbackOutlined />} type="dashed" href='/'/>
        </Tooltip>
        <Title level={2}>{`${calculator?.name} Calculator`}</Title>
        <Tooltip title={ favorite ? "Remove from favorites" : "Add to favorites"  } color="#001529">
          <Button
            icon={favorite ? <StarFilled /> : <StarOutlined />}
            type="dashed"
            onClick={handleToggleFavorite}
          />
        </Tooltip>
      </Flex>
      <Divider />
      <Paragraph>
        <blockquote>{calculator?.description ?? ''}</blockquote>
      </Paragraph>
    </>
  );
};

export default Calculator;
