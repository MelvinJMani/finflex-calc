import { Avatar, Card, Col } from 'antd';
const { Meta } = Card;

import longTermIcon from '../assets/icons/long_term.webp';
import sipIcon from '../assets/icons/sip.webp';
import swpIcon from '../assets/icons/swp.webp';
import stepUpIcon from '../assets/icons/step_up.webp';
import ssyIcon from '../assets/icons/ssy.webp';
import lumpsumIcon from '../assets/icons/lumpsum.webp';

export type IconKeys = 'long_term' | 'sip' | 'swp' | 'step_up' | 'ssy' | 'lumpsum';

const iconMap: Record<IconKeys, string> = {
  long_term: longTermIcon,
  sip: sipIcon,
  swp: swpIcon,
  step_up: stepUpIcon,
  ssy: ssyIcon,
  lumpsum: lumpsumIcon,
};

type CalculatorLinkProps = {
  title: string;
  description: string;
  link: string;
  icon: IconKeys
};

const CalculatorLink: React.FC<CalculatorLinkProps> = ({
  title,
  description,
  link,
  icon
}) => {
  const iconPath = icon ? iconMap[icon] : null;
  return (
    <Col className="gutter-row" span={6}>
      <a href={`/calculator/${link}`}>
        <Card hoverable style={{ width: 280, minHeight: 300 }}>
          <Meta avatar={<Avatar shape="square" size={64} src={iconPath} />} title={title} description={description} />
        </Card>
      </a>
    </Col>
  );
};

export default CalculatorLink;
