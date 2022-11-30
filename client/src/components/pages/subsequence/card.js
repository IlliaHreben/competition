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
  IconButton
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { parseTimeFromSec, calculateSecFromFight } from '../../../utils/datetime';
import { groupByCriteria } from '../../../utils/grouping';
import Draggable from './draggable';
import Droppable from './droppable';

function getTotalTimeFormatted(fightsList) {
  const totalTime = fightsList.reduce(
    (sum, f) => sum + calculateSecFromFight(f.linked.fightFormula),
    0
  );
  const { hours, minutes, seconds } = parseTimeFromSec(totalTime);
  return `${hours}h ${minutes} min ${seconds} sec`;
}

export default function SectionCard({ fightGroup }) {
  const [open, setOpen] = useState(false);

  const category = fightGroup[0].linked.category;

  const duration = getTotalTimeFormatted(fightGroup);
  const categories = groupByCriteria(fightGroup, ['linked/category/id', 'degree']);
  const start = fightGroup[0].serialNumber;
  const end = fightGroup.at(-1).serialNumber;

  const [border, setBorder] = useState(false);
  return (
    <>
      {border && <div style={{ border: '1px dashed grey', marginBottom: '5px' }}></div>}
      <Droppable
        onDrop={(item) => console.log(item)}
        onOver={() => setBorder(true)}
        onOverLeft={() => setBorder(false)}
      >
        <Draggable item={fightGroup}>
          <Card sx={{ width: 320, pb: 0 }}>
            <CardContent sx={{ cursor: 'move', p: 1, pb: '10px !important' }}>
              <Typography variant='h6' component='div'>
                {start} - {end}. {category.linked.section.name.toUpperCase()}
                {`: ${category.ageFrom} - ${category.ageTo}`}
              </Typography>

              <Stack
                direction='row'
                sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <Stack>
                  <Typography variant='caption' sx={{ mb: 1 }} color='text.secondary'>
                    {category.sectionId}
                  </Typography>
                  <Typography variant='body2'>Duration: {duration}</Typography>
                </Stack>
                {getIconButton(open, () => setOpen((prev) => !prev))}
              </Stack>
            </CardContent>
            <Collapse in={open} timeout='auto' unmountOnExit>
              {getList(categories)}
            </Collapse>
          </Card>
        </Draggable>
      </Droppable>
    </>
  );
}
SectionCard.propTypes = {
  fightGroup: PropTypes.array.isRequired
};

function getIconButton(open, onClick) {
  return <IconButton onClick={onClick}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>;
}

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
  return (
    <>
      {border && <div style={{ border: '1px dashed grey' }}></div>}
      <Droppable
        onDrop={(item) => console.log(item)}
        onOver={() => setBorder(true)}
        onOverLeft={() => setBorder(false)}
      >
        <Draggable item={fightsList}>
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
                    <Typography variant='caption'>{getTotalTimeFormatted(fightsList)}</Typography>
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
        </Draggable>
      </Droppable>
    </>
  );
}
ListCategory.propTypes = {
  fightsList: PropTypes.array.isRequired
};
