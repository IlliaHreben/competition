import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Stack
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { getTotalTime } from './helpers';
import { groupByCriteria } from '../../../utils/grouping';
import DraggableDroppable from '../../ui-components/draggable-droppable';
import { shiftFights, listFights } from '../../../actions/fights';
import { showSuccess } from '../../../actions/errors';
import ExpandIconButton from '../../../utils/component-utils';

export default function SectionCard({ fightGroup }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { category, fightSpace } = fightGroup[0].linked;

  const duration = getTotalTime(fightGroup);
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
                  {category.sectionId}
                </Typography>
                <Typography variant='body2'>Duration: {duration}</Typography>
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
  fightGroup: PropTypes.array.isRequired
};

function getList(categories) {
  return (
    <List>
      {categories.map((fightsList) => {
        const category = fightsList[0].linked.category;
        return (
          <ListCategory key={`${category.id}-${fightsList[0].degree}`} fightsList={fightsList} />
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
          <ListItemButton
            dense
            disableRipple
            sx={{ width: '100%' }} /* onClick={() => setOpen((prev) => !prev)} */
          >
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
            {/* {open ? <ExpandLess /> : <ExpandMore />} */}
          </ListItemButton>
          {/* <Collapse in={open} sx={{ width: '100%' }} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {fightsList.map((fight) => {
            const fighter1 = fight?.linked?.firstCard?.linked?.fighter || {};
            const fighter2 = fight?.linked?.secondCard?.linked?.fighter || {};
            return (
              <ListItemButton sx={{ width: '100%' }} key={fight.id}>
                <ListItemText
                  secondaryTypographyProps={{ variant: 'caption' }}
                  primary={`${fight.serialNumber}. 1/${fight.degree} ${
                    fighter1.lastName || 'N/A'
                  } vs ${fighter2.lastName || 'N/A'}`}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse> */}
        </ListItem>
      </DraggableDroppable>
    </>
  );
}
ListCategory.propTypes = {
  fightsList: PropTypes.array.isRequired
};
