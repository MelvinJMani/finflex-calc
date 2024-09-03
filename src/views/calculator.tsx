import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculatorByName } from '../utils';
import { Button, Row, Col, Flex, Typography, Tooltip, Divider } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import FavoriteButton from '../components/FavoriteButton';
import DynamicFormLoader from '../components/forms';
import ResultView from '../components/ResultView';

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
  const [results, setResults] = useState<ResultDataItem[]>([]);

  const showResult = (result: ResultDataItem[]) => {
    // Handle the form submission and set the result
    setResults(result);

    // Scroll to result area in mobile view
    if (window.innerWidth <= 768) {
      const resultArea = document.getElementById('result-area');
      if (resultArea) {
        resultArea.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <Flex
        gap="middle"
        vertical={false}
        style={boxStyle}
        justify="flex-start"
        align="center"
      >
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
          <div id="result-area" style={resultAreaStyle}>
            <DynamicFormLoader form={name} onResult={showResult} />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div
            id="result-area"
            style={results.length > 0 ? resultAreaStyle : {}}
          >
            <ResultView results={results} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Calculator;
