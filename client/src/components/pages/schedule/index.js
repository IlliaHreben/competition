import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Container, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getTotalTime } from './helpers';
import Card, { SectionCardMock } from './card';
import FightSpaceHeader from './fight-space-header';
import { groupByCriteria, splitBy } from 'utils/grouping';
import { listFights, clearFights } from 'actions/fights';
import { list as listFightSpaces } from 'actions/fight-spaces';
// import CircularProgress from 'components/ui-components/circular-progress';
import { useDidUpdateEffect } from 'utils/hooks';

function mapState(state) {
  return {
    active: state.competitions.active,
    fights: state.fights.list,
    fightSpaces: state.fightSpaces.list
  };
}

export default function Schedule() {
  const dispatch = useDispatch();
  const { active, fights, fightSpaces } = useSelector(mapState);
  console.log('='.repeat(50)); // !nocommit
  console.log(fightSpaces);
  console.log('='.repeat(50));

  useEffect(() => {
    document.title = 'Schedule';
    dispatch(clearFights());
    return () => dispatch(clearFights());
  }, [dispatch]);

  useEffect(() => {
    if (!active) return;
    dispatch(
      listFights({
        competitionId: active.id,
        include: ['categoryWithSection', 'cardsWithFighter', 'fightFormula', 'fightSpace']
      })
    );
    dispatch(listFightSpaces(active.id));
  }, [active, dispatch]);

  const [fightGroups, setFightGroups] = useState([]);

  useDidUpdateEffect(() => {
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
              {fightSpaces
                .filter((fs) => fs.competitionDay === i + 1)
                .map((fs) => {
                  const groupedBySection =
                    groupedByFS.find((group) => group[0][0].fightSpaceId === fs.id) || [];
                  return (
                    <Grid key={fs.id} sx={{ maxWidth: 374, flexGrow: 1 }} item>
                      <FightSpaceHeader
                        duration={getTotalTime(groupedBySection.flat(3), false)}
                        fightSpace={fs}
                      />
                      <Paper
                        sx={{ backgroundColor: '#e7ebf0', maxWidth: 350, minHeight: 125 }}
                        elevation={0}
                      >
                        <Grid sx={{ justifyContent: 'center' }} container spacing={1}>
                          {groupedBySection.length ? (
                            groupedBySection.map((fightGroup, i) => {
                              const category = fightGroup[0].linked.category;

                              return (
                                <Grid
                                  item
                                  key={`${category.sectionId}-${category.ageFrom}-${category.ageTo}-${fightGroup[0].id}`}
                                  spacing={0.5}
                                  direction='column'
                                >
                                  <Card
                                    fightGroup={fightGroup}
                                    fightsTimeBefore={getTotalTime(
                                      groupedBySection.slice(0, i).flat(3),
                                      false
                                    )}
                                    fightSpace={fs}
                                  ></Card>
                                </Grid>
                              );
                            })
                          ) : (
                            <SectionCardMock fightSpace={fs} />
                          )}
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Fragment>
        ))}
      </DndProvider>
    </Container>
  );
}
