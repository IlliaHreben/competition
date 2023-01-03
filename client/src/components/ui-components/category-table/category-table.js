import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useEffect, useState } from 'react';

import { formatISODate, getFormattedDate } from 'utils/datetime';
import ExpandIconButton from 'utils/component-utils';
import styles from './category-table.module.css';
import { categoryPropTypes } from './prop-types';

function dumpCategoryData(category) {
  const { fights, cards } = category.linked;
  const cardsData = fights.length
    ? fights.flatMap((f) => [
        {
          ...f.linked.firstCard,
          fight: f,
          isFirst: true
        },
        {
          ...f.linked.secondCard,
          fight: f,
          isFirst: false
        }
      ])
    : cards;

  return cardsData.map(dumpCardData).sort((a, b) => a.number - b.number);
}

function dumpCardData(card) {
  const { isFirst, fight } = card;
  const fighter = card.linked?.fighter;
  const coach = card.linked?.fighter?.linked.coach;
  const club = card.linked?.fighter?.linked.club;

  return {
    id: card.id,
    date: fight && getFormattedDate(), // TODO
    degree: fight ? `1/${fight.degree}` : '',
    color: isFirst !== undefined ? (isFirst ? 'red' : 'blue') : '',
    number: fight ? fight.orderNumber * 2 - +isFirst : 1,
    fullName: getFullName(fighter),
    sex: fighter?.sex || '',
    settlement: club?.linked?.settlement?.name || '',
    club: club?.name || '',
    coach: getCoachFullName(coach),
    age: card.age || '',
    birthDate: card.birthDate ? formatISODate(card.birthDate) : '',
    weight: card.weight || '',
    serialNumber: fight?.serialNumber
  };
}

function getCoachFullName(fighter) {
  return fighter ? `${fighter?.name} ${fighter?.lastName}` : '';
}

function getFullName(fighter) {
  return fighter ? `${fighter?.lastName} ${fighter?.name}` : '';
}

function CategoryTable({
  category,
  openCardSettings,
  openCategorySettings,
  openTable,
  disableHeader
}) {
  const rows = dumpCategoryData(category);

  const [open, setOpen] = useState(openTable);

  useEffect(() => {
    setOpen(openTable);
  }, [openTable]);

  const groupText = category.group ? `group ${category.group},` : '';

  const sex = { man: 'men', woman: 'women' }[category.sex] || category;

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table sx={{ minWidth: 200 }} size='small'>
        <TableHead>
          <TableRow>
            <TableCell
              // padding='checkbox'
              className={styles.tableCategoryDesc}
              sx={{ borderBottom: 'none' }}
              colSpan={13}
              align='center'
            >
              <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <ExpandIconButton
                  open={open}
                  onClick={() => setOpen((prev) => !prev)}
                  size='small'
                  sx={{ color: '#f0efef' }}
                  iconProps={{ size: 'small' }}
                />
                <Typography>
                  {`${category.linked.section.name} in: ${sex} ${category.ageFrom} - ${category.ageTo} years, ${groupText} weight category ${category.weightName}`}
                </Typography>
                {openCategorySettings ? (
                  <IconButton
                    size='small'
                    aria-label='delete'
                    onClick={(e) => openCategorySettings(e, category)}
                    sx={{ color: '#f0efef' }}
                  >
                    <MoreVertIcon size='small' />
                  </IconButton>
                ) : (
                  <div />
                )}
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Collapse in={open} timeout='auto'>
        <Table sx={{ minWidth: 200 }} size='small'>
          {!disableHeader && (
            <TableHead>
              <TableRow className={styles.tableHeadDesc}>
                <TableCell sx={{ paddingRight: '1 !important' }} align='center' padding='checkbox'>
                  №
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell align='center'>Degree</TableCell>
                <TableCell align='center'>Corner</TableCell>
                <TableCell align='left'>№</TableCell>
                <TableCell align='left'>Full name</TableCell>
                <TableCell align='left'>City</TableCell>
                <TableCell align='center'>Sex</TableCell>
                <TableCell align='left'>Club</TableCell>
                <TableCell align='left'>Coach</TableCell>
                <TableCell align='center'>Age</TableCell>
                <TableCell align='left'>Birthday</TableCell>
                <TableCell align='left'>Weight</TableCell>
                {/* <TableCell align='left'></TableCell> */}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {rows.map((row) => (
              <TableRow
                className={styles.tableRow}
                key={row.number}
                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {row.number % 2 ? (
                  <TableCell
                    align='center'
                    width='3%'
                    sx={{ pr: 0 }}
                    rowSpan={2}
                    component='th'
                    scope='row'
                    padding='checkbox'
                  >
                    <Typography variant='h5'>{row.serialNumber}</Typography>
                  </TableCell>
                ) : null}
                {row.number % 2 ? (
                  <TableCell width='7%' rowSpan={2} component='th' scope='row'>
                    {row.date}
                  </TableCell>
                ) : null}
                {row.number % 2 ? (
                  <TableCell width='5%' rowSpan={2} align='center'>
                    {row.degree}
                  </TableCell>
                ) : null}
                <TableCell width='5%' align='center'>
                  {row.color}
                </TableCell>
                <TableCell width='2%' align='left'>
                  {row.number}
                </TableCell>
                <TableCell width='15%' align='left'>
                  {row.fullName}
                </TableCell>
                <TableCell width='14%' align='left'>
                  {row.settlement}
                </TableCell>
                <TableCell width='4%' align='center'>
                  {row.sex}
                </TableCell>
                <TableCell width='16%' align='left'>
                  {row.club}
                </TableCell>
                <TableCell width='11.5%' align='left'>
                  {row.coach}
                </TableCell>
                <TableCell width='4%' align='center'>
                  {row.age}
                </TableCell>
                <TableCell width='7%' align='left'>
                  {row.birthDate}
                </TableCell>
                <TableCell width='5%' align='left' sx={{ paddingRight: 0 }}>
                  {row.weight}
                </TableCell>
                {openCardSettings && (
                  <TableCell padding='none' sx={{ paddingRight: 0.5 }} align='right'>
                    <IconButton size='small' onClick={(e) => openCardSettings(e, row, category)}>
                      <MoreVertIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </TableContainer>
  );
}

CategoryTable.propTypes = categoryPropTypes;

export default CategoryTable;
