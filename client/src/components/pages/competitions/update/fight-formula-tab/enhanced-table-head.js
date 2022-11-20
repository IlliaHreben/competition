import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { PropTypes } from 'prop-types';

const headCells = [
  { id: 'settings', allowSort: false, label: '', disablePadding: true },
  { id: 'section', allowSort: true, label: 'Section' },
  { id: 'roundCount', allowSort: true, label: 'Rounds', disablePadding: true },
  { id: 'roundTime', allowSort: true, label: 'Round time (min)' },
  { id: 'breakTime', allowSort: true, label: 'Break time (sec)' },
  { id: 'weightFrom', allowSort: true, label: 'Weight' },
  { id: 'ageFrom', allowSort: true, label: 'Age' },
  { id: 'sex', allowSort: true, label: 'Sex' },
  { id: 'group', allowSort: true, label: 'Group', disablePadding: true },
  { id: 'degree', allowSort: true, label: 'Degree', disablePadding: true }
];

export default function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.allowSort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};
