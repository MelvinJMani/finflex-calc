import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculatorByName } from '../utils';
import { Button, Row, Col, Flex, Typography, Tooltip, Divider } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import FavoriteButton from '../components/FavoriteButton';
import DynamicFormLoader from '../components/forms';

const { Title, Paragraph } = Typography;

const boxStyle: React.CSSProperties = {
  width: '100%',
  height: 50,
};

const resultAreaStyle: React.CSSProperties = {
  padding: '16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

export type ResultDataItem = {
  label: string;
  value: string | number;
};

const Calculator: React.FC = () => {
  const { name = '' } = useParams();
  const calculator = getCalculatorByName(name);
  const [result, setResult] = useState<string | null>(null);

  const showResult = (result: ResultDataItem[]) => {
    // Handle the form submission and set the result
    setResult(`Calculated Result: ${JSON.stringify(result)}`);

    // Scroll to result area in mobile view
    if (window.innerWidth <= 768) {
      const resultArea = document.getElementById('result-area');
      if (resultArea) {
        resultArea.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Flex gap="middle" vertical={false} style={boxStyle} justify="flex-start" align="center">
        <Tooltip title="Go back" color="#001529">
          <Button icon={<RollbackOutlined />} type="dashed" href="/" />
        </Tooltip>
        <Title level={2}>{`${calculator?.name} Calculator`}</Title>
        <FavoriteButton name={name} />
      </Flex>
      <Divider />
      <Paragraph>
        <blockquote>{calculator?.description ?? ''}</blockquote>
      </Paragraph>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={12}>
          <div>
            <DynamicFormLoader form={name} onResult={showResult} />
          </div>
        </Col>
        <Col xs={24} md={12}>
          {result && (
            <div id="result-area" style={resultAreaStyle}>
              <Title level={4}>Result</Title>
              <Paragraph>{result}</Paragraph>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Calculator;
