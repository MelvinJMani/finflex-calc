import { Avatar, Card, Col } from 'antd';
const { Meta } = Card;
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import longTermIcon from '../assets/icons/long_term.webp';
import sipIcon from '../assets/icons/sip.webp';
import swpIcon from '../assets/icons/swp.webp';
import stepUpIcon from '../assets/icons/step_up.webp';
import ssyIcon from '../assets/icons/ssy.webp';
import lumpsumIcon from '../assets/icons/lumpsum.webp';
import cagr from '../assets/icons/cagr.webp';

export type IconKeys =
  | 'long_term'
  | 'sip'
  | 'swp'
  | 'step_up'
  | 'ssy'
  | 'lumpsum' 
  | 'cagr' ;

const iconMap: Record<IconKeys, string> = {
  long_term: longTermIcon,
  sip: sipIcon,
  swp: swpIcon,
  step_up: stepUpIcon,
  ssy: ssyIcon,
  lumpsum: lumpsumIcon,
  cagr: cagr
};

type CalculatorLinkProps = {
  title: string;
  description: string;
  link: string;
  icon: IconKeys;
};

const CalculatorLink: React.FC<CalculatorLinkProps> = ({
  title,
  description,
  link,
  icon,
}) => {
  const navigate = useNavigate();
  const iconPath = icon ? iconMap[icon] : null;
  return (
    <Col className="gutter-row" span={6}>
      <Card
        hoverable
        style={{ width: 280, minHeight: 300 }}
        onClick={() => navigate(`/calculator/${link}`)}
      >
        <Meta
          avatar={<Avatar shape="square" size={64} src={iconPath} />}
          title={
            <>
              {' '}
              {title} <FavoriteButton name={link} />{' '}
            </>
          }
          description={description}
        />
      </Card>
    </Col>
  );
};

export default CalculatorLink;
