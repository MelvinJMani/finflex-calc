import React from 'react';
import { ResultDataItem } from '../views/calculator';
import { Typography } from 'antd';
import { formatRupeeAmount } from '../utils';

const { Title, Text } = Typography;

type ResultProps = {
  results: ResultDataItem[];
};

const ResultView: React.FC<ResultProps> = ({ results }) => {
  return (
    <>
      {results.map((result: ResultDataItem, index: number) => (
        <React.Fragment key={`${index}`}>
          <Title level={4}>{result.label}</Title>
          <Text italic>{formatRupeeAmount(result.value)}</Text>
        </React.Fragment>
      ))}
    </>
  );
};

export default ResultView;
