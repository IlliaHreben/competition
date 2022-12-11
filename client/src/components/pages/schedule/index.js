import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Container, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getTotalTime } from './helpers';
import Card from './card';
import FightSpaceHeader from './fight-space-header';
import { groupByCriteria, splitBy } from '../../../utils/grouping';
import { listFights } from '../../../actions/fights';

function mapState(state) {
  return {
    active: state.competitions.active,
    fights: state.fights.list
  };
}

export default function Schedule() {
  useEffect(() => {
    document.title = 'Schedule';
  }, []);

  const dispatch = useDispatch();
  const { active, fights } = useSelector(mapState);

  useEffect(() => {
    if (!active) return;
    dispatch(
      listFights({
        competitionId: active.id,
        include: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace']
      })
    );
  }, [active, dispatch]);

  const [fightGroups, setFightGroups] = useState([]);

  useEffect(() => {
    const groups = splitBy(fights, (fight) => fight.linked.fightSpace.competitionDay - 1).map(
      (splittedByDay) =>
        groupByCriteria(splittedByDay, ['fightSpaceId']).map((groupedByFS) =>
          groupByCriteria(
            groupedByFS,
            ['linked/category/sectionId', 'linked/category/ageFrom', 'linked/category/ageTo'],
            { splitByOrder: 'serialNumber' }
          )
        )
    );
    setFightGroups(groups);
  }, [fights]);

  return (
    <Container sx={{ overflow: 'auto' }} maxWidth='auto'>
      <DndProvider backend={HTML5Backend}>
        {fightGroups.map((groupedByFS, i) => (
          <Fragment key={i}>
            <Typography
              sx={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', mt: 3 }}
              variant='h2'
            >
              DAY {i + 1}
            </Typography>
            <Grid sx={{ mt: 2, justifyContent: 'center' }} container spacing={3}>
              {groupedByFS.map((groupedBySection) => (
                <Grid key={groupedBySection[0][0].fightSpaceId} item>
                  <FightSpaceHeader
                    duration={getTotalTime(groupedBySection.flat(3), false)}
                    fightSpace={groupedBySection[0][0].linked.fightSpace}
                  />
                  <Paper sx={{ backgroundColor: '#e7ebf0', maxWidth: 350 }} elevation={0}>
                    <Grid sx={{ justifyContent: 'center' }} container spacing={1}>
                      {groupedBySection.map((fightGroup, i) => {
                        const category = fightGroup[0].linked.category;

                        return (
                          <Grid
                            item
                            key={`${category.sectionId}-${category.ageFrom}-${category.ageTo}-${fightGroup[0].id}`}
                            spacing={0.5}
                          >
                            <Card
                              fightGroup={fightGroup}
                              fightsTimeBefore={getTotalTime(
                                groupedBySection.slice(0, i).flat(3),
                                false
                              )}
                              fightSpace={groupedBySection[0][0].linked.fightSpace}
                            ></Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Fragment>
        ))}
      </DndProvider>
    </Container>
  );
}
