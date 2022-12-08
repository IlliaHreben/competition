import { Avatar, Typography, Box, Stack } from '@mui/material';
import { PropTypes } from 'prop-types';
import { DateTime, Duration } from 'luxon';
import ErrorIcon from '@mui/icons-material/Error';

import RingIcon from '../../../assets/icons/ring.png';
import TatamiIcon from '../../../assets/icons/tatami.png';

export default function FightSpaceHeader({ duration, fightSpace }) {
  // const [startAtHour, startAtMinute, startAtSecond] = fightSpace.startAt.split(':');
  const startTime = DateTime.fromSQL(fightSpace.startAt);
  const finishTime = DateTime.fromSQL(fightSpace.finishAt);
  const breakDuration = Duration.fromISOTime(fightSpace.breakFinishAt).minus(
    Duration.fromISOTime(fightSpace.breakStartAt)
  );
  const fightsDuration = Duration.fromObject(duration);
  const realFinishTime = startTime.plus(breakDuration).plus(fightsDuration);

  const formattedDuration = fightsDuration.toFormat('hh:mm');
  const formattedStartTime = startTime.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedFinishTime = finishTime.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedRealFinishAt = realFinishTime.toLocaleString(DateTime.TIME_24_SIMPLE);

  const isOverflowed = realFinishTime > finishTime;
  const overflow = realFinishTime.diff(finishTime).toFormat('hh:mm');

  return (
    <Box sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Avatar src={fightSpace.type === 'ring' ? RingIcon : TatamiIcon} variant='rounded' />
      <Stack>
        <Stack direction='row' sx={{ ml: 2, mb: -1.7 }}>
          <Typography variant='h4'>
            {fightSpace.type.toUpperCase()} {fightSpace.orderNumber}
          </Typography>
          <Stack sx={{ ml: 1, mt: -0.4, alignSelf: 'baseline' }}>
            <Typography variant='overline' sx={{ mb: -2, color: 'rgba(0, 0, 0, 0.6)' }}>
              Duration: {formattedDuration}
            </Typography>
            {/* <Divider orientation='vertical' flexItem /> */}
            <Typography variant='overline' sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
              Finish: {formattedRealFinishAt}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction='row' sx={{ alignItems: 'center' }}>
          <Typography variant='button' sx={{ ml: 2, lineHeight: 1.3, color: 'rgba(0, 0, 0, 0.6)' }}>
            {formattedStartTime} - {formattedFinishTime}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              ml: 1,
              mr: 0.2,
              color: isOverflowed ? 'rgb(255, 98, 98)' : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            {overflow}
          </Typography>
          {isOverflowed && <ErrorIcon sx={{ fontSize: 13, color: 'rgb(255, 98, 98)' }} />}
        </Stack>
      </Stack>
    </Box>
  );
}
FightSpaceHeader.propTypes = {
  fightSpace: PropTypes.object.isRequired,
  duration: PropTypes.object.isRequired
};
