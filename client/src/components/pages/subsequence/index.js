import { useEffect, useState } from 'react';
import { listFights } from '../../../actions/fights';
import { useSelector, useDispatch } from 'react-redux';
import { groupByCriteria, splitBy } from '../../../utils/grouping';
import { Container, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import Card from './card';

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
        <Grid key={i} sx={{ mt: 2, justifyContent: 'center' }} container spacing={3}>
          {groupedByFS.map((groupedBySection, j) => (
            <Grid key={groupedBySection[0][0].fightSpaceId} item>
              <Paper sx={{ backgroundColor: '#e7ebf0', maxWidth: 350 }} elevation={0}>
                <Grid key={i} sx={{ justifyContent: 'center' }} container spacing={1}>
                  {groupedBySection.map((fightGroup) => {
                    const category = fightGroup[0].linked.category;

                    return (
                      <Grid
                        item
                        key={`${category.sectionId}-${category.ageFrom}-${category.ageTo}`}
                        spacing={0.5}
                      >
                        <Card fightGroup={fightGroup}></Card>
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
