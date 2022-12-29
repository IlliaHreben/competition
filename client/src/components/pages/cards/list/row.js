import { TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';

export const columns = [
  { width: 200, cellData: 'Full name', field: 'fullName' },
  { width: 50, cellData: 'Sex', field: 'sex' },
  { width: 165, cellData: 'City', field: 'settlement' },
  { width: 190, cellData: 'Club', field: 'clubName' },
  { width: 120, cellData: 'Coach', field: 'coachFullName' },
  { width: 28, cellData: 'Age', field: 'age', numeric: true },
  { width: 78, cellData: 'Birthday', field: 'birthDate' },
  { width: 40, cellData: 'Weight', field: 'weight', numeric: true },
  { width: 40, cellData: 'Group', field: 'group' },
  { width: 97, cellData: 'Section', field: 'section' },
  { cellData: '', field: 'settings' }
];

export const Row = ({ data, style }) => (
  <TableRow
    component='div'
    key={data.id}
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 0
    }}
    style={style}
  >
    {columns.map(({ field }, columnIndex) => {
      return (
        <TableCell
          component='div'
          key={field}
          sx={{
            display: 'block',
            flexGrow: 0,
            flexShrink: 0,
            // display: 'flex',
            // alignItems: 'center',
            ...(columns[columnIndex].width
              ? { flexBasis: columns[columnIndex].width }
              : { flex: 1 }),
            whiteSpace: 'nowrap'
          }}
          size={field === 'settings' ? 'small' : 'auto'}
          width={columns[columnIndex].width}
          variant='body'
          height={style.height}
        >
          {data[field]}
        </TableCell>
      );
    })}
  </TableRow>
);

Row.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object
};
