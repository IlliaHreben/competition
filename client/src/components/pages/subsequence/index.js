import { useEffect, useState } from 'react';
import { listFights } from '../../../actions/fights';
import { useSelector, useDispatch } from 'react-redux';
import { groupByCriteria, splitBy } from '../../../utils/grouping';
import { Container, Paper, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { parseTimeFromSec, calculateSecFromFight } from '../../../utils/datetime';

function mapState(state) {
  return {
    active: state.competitions.active,
    fights: state.fights.list
  };
}

// const structure = {
//   dividers: ['fightSpaceId'],
//   nested: {
//     dividers: ['sectionId'],
//     columns: [
//       { name: 'Section', getValue: (items) => items[0].linked.section.name },
//       {
//         name: 'Age',
//         getValue: (items) =>
//           items
//             .flatMap((i) =>
//               Array(i.ageTo - i.ageFrom + 1)
//                 .fill()
//                 .map((_, i) => i.ageFrom + i)
//             )
//             .sort((a, b) => a - b)
//             .reduce((ageRanges, age) => {
//               const lastRange = ageRanges.at(-1);
//               if (ageRanges.length === 0) {
//                 ageRanges.push([age, age]);
//               } else if (lastRange[1] + 1 === age) {
//                 lastRange[1] = age;
//               } else {
//                 ageRanges.push([age, age]);
//               }
//               return ageRanges;
//             }, [])
//             .map((ageRange) =>
//               ageRange[0] === ageRange[1] ? ageRange[0] : `${ageRange[0]}-${ageRange[1]}`
//             )
//             .join(', ')
//       }
//     ],
//     nested: {
//       dividers: ['ageFrom', 'ageTo'],
//       columns: [
//         { name: 'Age', getValue: (items) => items[0].linked.section.name },
//         {
//           name: 'Degrees',
//           getValue: (items) =>
//             [...new Set(items.map((i) => i.degree))]
//               .sort((a, b) => a - b)
//               .map((i) => (i === 1 ? 'final' : `1/${i}`))
//               .join(', ')
//         }
//       ],
//       nested: {
//         dividers: ['ageFrom', 'ageTo']
//       }
//     }
//   }
// };

export default function Subsequence() {
  useEffect(() => {
    document.title = 'Subsequence';
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
    // dispatch(listCoaches({ competitionId: active.id, include: ['clubs'] }));
    // dispatch(listSections({ competitionId: active.id }));
  }, [active, dispatch]);

  const [fightGroups, setFightGroups] = useState([]);

  useEffect(() => {
    const groups = splitBy(fights, (fight) => fight.linked.fightSpace.competitionDay - 1).map(
      (splittedByDay) =>
        groupByCriteria(splittedByDay, ['fightSpaceId']).map((groupedByFS) =>
          groupByCriteria(groupedByFS, [
            'linked/category/sectionId',
            'linked/category/ageFrom',
            'linked/category/ageTo'
          ])
        )
    );
    setFightGroups(groups);
  }, [fights]);

  return (
    <Container sx={{ overflow: 'auto' }} maxWidth='auto'>
      {fightGroups.map((groupedByFS, i) => (
        <Grid
          key={i}
          sx={{ mt: 2 }}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {groupedByFS.map((groupedBySection, j) => (
            <Grid key={groupedBySection[0][0].fightSpaceId} item>
              <Paper sx={{ backgroundColor: '#e7ebf0', maxWidth: 572 }} elevation={0}>
                <Grid key={i} container spacing={1}>
                  {groupedBySection.map((fightGroup) => {
                    const category = fightGroup[0].linked.category;
                    const totalTimeSec = fightGroup.reduce(
                      (timeSec, f) => timeSec + calculateSecFromFight(f.linked.fightFormula),
                      0
                    );
                    const { hours, minutes, seconds } = parseTimeFromSec(totalTimeSec);
                    const duration = `${hours}h ${minutes} min ${seconds} sec`;
                    return (
                      <Grid
                        item
                        // p={1}
                        key={`${category.sectionId}-${category.ageFrom}-${category.ageTo}`}
                        spacing={0.5}
                      >
                        <Card sx={{ width: 270 }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant='h6' component='div'>
                              {category.linked.section.name.toUpperCase()}
                              {`: ${category.ageFrom} - ${category.ageTo}`}
                            </Typography>
                            <Typography variant='caption' sx={{ mb: 1.5 }} color='text.secondary'>
                              {category.sectionId}
                            </Typography>
                            <Typography variant='body2'>Duration: {duration}</Typography>
                          </CardContent>
                          <CardActions sx={{ pt: 0, pb: 0 }}>
                            <Button size='small'>Expand</Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Container>
  );
}
