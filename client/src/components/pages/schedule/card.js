import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Stack,
  Box
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DateTime, Duration } from 'luxon';

import { getTotalTime } from './helpers';
import { groupByCriteria } from 'utils/grouping';
import DraggableDroppable from 'components/ui-components/draggable-droppable';
import Droppable from 'components/ui-components/droppable';
import { shiftFights, listFights } from 'actions/fights';
import { showSuccess } from 'actions/errors';
import ExpandIconButton from 'utils/component-utils';

export function SectionCardMock({ fightSpace }) {
  const dispatch = useDispatch();

  const handleDrop = (fights) => {
    dispatch(
      shiftFights(
        {
          fightSpaceId: fightSpace.id,
          id: fights.map((f) => f.id),
          place: 1
        },
        () => {
          dispatch(showSuccess('Fights has been successfully shifted.'));
          dispatch(
            listFights({
              competitionId: fightSpace.competitionId,
              include: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace']
            })
          );
        }
      )
    );
  };

  return (
    <Droppable onDrop={handleDrop}>
      <Box
        sx={{
          width: 320,
          height: '100px',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          border: '1px dashed',
          borderRadius: '4px',
          color: 'rgba(0,0,0,0.5)'
        }}
      >
        <Typography
          variant='outlined'
          component='div'
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Empty
        </Typography>
      </Box>
    </Droppable>
  );
}
SectionCardMock.propTypes = {
  fightSpace: PropTypes.object.isRequired
};

export default function SectionCard({ fightGroup, fightsTimeBefore, fightSpace }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const startTime = DateTime.fromSQL(fightSpace.startAt);
  const breakStartAt = DateTime.fromSQL(fightSpace.breakStartAt);
  const breakDuration = Duration.fromISOTime(fightSpace.breakFinishAt).minus(
    breakStartAt.toObject()
  );
  const beforeFightsDuration = Duration.fromObject(fightsTimeBefore);
  const startAtWithoutBreak = startTime.plus(beforeFightsDuration);
  const duration = Duration.fromObject(getTotalTime(fightGroup, false));
  const finishAtWithoutBreak = startAtWithoutBreak.plus(duration);

  const fightsStartAt =
    startAtWithoutBreak > breakStartAt
      ? startAtWithoutBreak.plus(breakDuration)
      : startAtWithoutBreak;
  const fightsFinishAt =
    finishAtWithoutBreak > breakStartAt
      ? finishAtWithoutBreak.plus(breakDuration)
      : finishAtWithoutBreak;

  const formattedDuration = duration.toFormat('hh:mm:ss');
  const formattedStartTime = fightsStartAt.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedFinishTime = fightsFinishAt.toLocaleString(DateTime.TIME_24_SIMPLE);

  const { category } = fightGroup[0].linked;

  const categories = groupByCriteria(fightGroup, ['linked/category/id', 'degree']);
  const start = fightGroup[0].serialNumber;
  const end = fightGroup.at(-1).serialNumber;

  const handleDrop = (fights) => {
    dispatch(
      shiftFights(
        {
          fightSpaceId: fightSpace.id,
          id: fights.map((f) => f.id),
          place: fightGroup[0].serialNumber
        },
        () => {
          dispatch(showSuccess('Fights has been successfully shifted.'));
          dispatch(
            listFights({
              competitionId: fightSpace.competitionId,
              include: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace']
            })
          );
        }
      )
    );
  };

  const [border, setBorder] = useState(false);
  return (
    <>
      {border && <div style={{ border: '1px dashed grey', marginBottom: '5px' }}></div>}
      <DraggableDroppable
        onDrop={handleDrop}
        onOver={() => setBorder(true)}
        onOverLeft={() => setBorder(false)}
        item={fightGroup}
      >
        <Card sx={{ width: 320, pb: 0 }}>
          <CardContent sx={{ cursor: 'move', p: 1, pb: '10px !important' }}>
            <Typography variant='h6' component='div'>
              {start} - {end}. {category.linked.section.name.toUpperCase()}
              {`: ${category.ageFrom} - ${category.ageTo}`}
            </Typography>

            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Stack>
                <Typography variant='caption' sx={{ mb: 1 }} color='text.secondary'>
                  {formattedStartTime} - {formattedFinishTime}
                </Typography>
                <Typography variant='body2'>Duration: {formattedDuration}</Typography>
              </Stack>
              <ExpandIconButton open={open} onClick={() => setOpen((prev) => !prev)} />
            </Stack>
          </CardContent>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {getList(categories)}
          </Collapse>
        </Card>
      </DraggableDroppable>
    </>
  );
}
SectionCard.propTypes = {
  fightGroup: PropTypes.array.isRequired,
  fightsTimeBefore: PropTypes.object.isRequired,
  fightSpace: PropTypes.object.isRequired
};

function getList(categories) {
  return (
    <List>
      {categories.map((fightsList) => {
        const { category, fightSpace } = fightsList[0].linked;

        return (
          <ListCategory
            key={`${category.id}-${fightsList[0].degree}`}
            fightsList={fightsList}
            fightSpace={fightSpace}
          />
        );
      })}
    </List>
  );
}

function ListCategory({ fightsList }) {
  const { weightFrom, weightTo, sex } = fightsList[0].linked.category;
  // const [open, setOpen] = useState(false);
  const [border, setBorder] = useState(false);
  const dispatch = useDispatch();

  const handleDrop = (fights) => {
    dispatch(
      shiftFights(
        {
          fightSpaceId: fightsList[0].fightSpaceId,
          id: fights.map((f) => f.id),
          place: fightsList[0].serialNumber
        },
        () => {
          dispatch(showSuccess('Fights has been successfully shifted.'));
          dispatch(
            listFights({
              competitionId: fightsList[0].linked.fightSpace.competitionId,
              include: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace']
            })
          );
        }
      )
    );
  };
  return (
    <>
      {border && <div style={{ border: '1px dashed grey' }}></div>}
      <DraggableDroppable
        onDrop={handleDrop}
        onOver={() => setBorder(true)}
        onOverLeft={() => setBorder(false)}
        item={fightsList}
      >
        <ListItem disablePadding sx={{ flexDirection: 'column' }}>
          <ListItemButton dense disableRipple sx={{ width: '100%' }}>
            <ListItemText
              disableTypography
              primary={
                <Stack sx={{ alignItems: 'flex-end' }} direction='row'>
                  <Typography variant='button'>{`${
                    weightFrom ? `${weightFrom} -` : 'Up to '
                  } ${weightTo}: ${sex}  `}</Typography>
                  <div style={{ width: '10px' }}></div>
                  <Typography variant='caption'>{getTotalTime(fightsList)}</Typography>
                </Stack>
              }
              secondary={
                <Stack>
                  {fightsList.map((fight) => {
                    const fighter1 = fight?.linked?.firstCard?.linked?.fighter || {};
                    const fighter2 = fight?.linked?.secondCard?.linked?.fighter || {};
                    return (
                      <Typography variant='caption' key={fight.id}>
                        {`${fight.serialNumber}. 1/${fight.degree} ${
                          fighter1.lastName || 'N/A'
                        } vs ${fighter2.lastName || 'N/A'}\n`}
                      </Typography>
                    );
                  })}
                </Stack>
              }
            />
          </ListItemButton>
        </ListItem>
      </DraggableDroppable>
    </>
  );
}
ListCategory.propTypes = {
  fightsList: PropTypes.array.isRequired
};
