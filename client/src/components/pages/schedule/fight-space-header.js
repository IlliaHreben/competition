import { Avatar, Typography, Box } from '@mui/material';
import { PropTypes } from 'prop-types';

import RingIcon from '../../../assets/icons/ring.png';
import TatamiIcon from '../../../assets/icons/tatami.png';

export default function FightSpaceHeader({ fightSpace }) {
  return (
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
      <Avatar src={fightSpace.type === 'ring' ? RingIcon : TatamiIcon} variant='rounded' />
      <Typography variant='h4' sx={{ textAlign: 'center', ml: 2 }}>
        {fightSpace.type.toUpperCase()} {fightSpace.orderNumber}
      </Typography>
    </Box>
  );
}
FightSpaceHeader.propTypes = {
  fightSpace: PropTypes.object.isRequired
};
