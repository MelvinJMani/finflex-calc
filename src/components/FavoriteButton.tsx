import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { isFavorite, toggleFavorite } from '../utils';

type FavoriteButtonProps = {
  name: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ name }) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite(name));
  const handleToggleFavorite = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const marked = toggleFavorite(name);
    if (marked) setFavorite(isFavorite(name));
  };
  return (
    <Tooltip
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      color="#001529"
    >
      <Button
        icon={favorite ? <StarFilled /> : <StarOutlined />}
        type="dashed"
        onClick={handleToggleFavorite}
      />
    </Tooltip>
  );
};

export default FavoriteButton;
