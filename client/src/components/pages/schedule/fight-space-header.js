import { Avatar, Typography, Box, Stack, Tooltip } from '@mui/material';
import { PropTypes } from 'prop-types';
import { DateTime, Duration } from 'luxon';
import ErrorIcon from '@mui/icons-material/Error';

import RingIcon from '../../../assets/icons/ring.png';
import TatamiIcon from '../../../assets/icons/tatami.png';

export default function FightSpaceHeader({ duration, fightSpace }) {
  // const [startAtHour, startAtMinute, startAtSecond] = fightSpace.startAt.split(':');
  const startTime = DateTime.fromSQL(fightSpace.startAt);
  const finishTime = DateTime.fromSQL(fightSpace.finishAt);
  const breakStartAt = Duration.fromISOTime(fightSpace.breakStartAt);
  const breakFinishAt = Duration.fromISOTime(fightSpace.breakFinishAt);
  const breakDuration = breakFinishAt.minus(breakStartAt);
  const fightsDuration = Duration.fromObject(duration);
  const realFinishTime = startTime.plus(breakDuration).plus(fightsDuration);

  const formattedDurationStartAt = breakStartAt.toFormat('hh:mm');
  const formattedDurationFinishAt = breakFinishAt.toFormat('hh:mm');
  const formattedDuration = fightsDuration.toFormat('hh:mm');
  const formattedStartTime = startTime.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedFinishTime = finishTime.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedRealFinishAt = realFinishTime.toLocaleString(DateTime.TIME_24_SIMPLE);

  const isOverflowed = realFinishTime > finishTime;
  const overflow = realFinishTime.diff(finishTime).toFormat('hh:mm');

  return (
    <Box sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip
        title={
          <Stack>
            <Typography variant='body2'>Duration: {formattedDuration}</Typography>
            <Typography variant='body2'>Finish: {formattedRealFinishAt}</Typography>
            <Typography variant='body2'>
              Break: {formattedDurationStartAt} - {formattedDurationFinishAt}
            </Typography>
          </Stack>
        }
      >
        <Avatar src={fightSpace.type === 'ring' ? RingIcon : TatamiIcon} variant='rounded' />
      </Tooltip>
      <Stack sx={{ ml: 1 }}>
        <Typography variant='h4'>
          {fightSpace.type.toUpperCase()} {fightSpace.orderNumber}
        </Typography>

        <Stack direction='row' sx={{ alignItems: 'center', mt: -1.5 }}>
          <Typography variant='button' sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
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
