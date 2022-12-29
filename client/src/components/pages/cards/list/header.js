import { TableCell, TableRow } from '@mui/material';
import { columns } from './row';

export const Header = () => {
  return (
    <TableRow
      component='div'
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        boxSizing: 'border-box',
        minWidth: '100%',
        width: '100%'
      }}
    >
      {columns.map(({ cellData, width, field }) => (
        <TableCell
          sx={{
            display: 'block',
            flexGrow: 0,
            flexShrink: 0,
            height: '24px',
            ...(width ? { flexBasis: width } : { flex: 1 })
          }}
          key={field}
          width={width}
          variant='head'
        >
          {cellData}
        </TableCell>
      ))}
    </TableRow>
  );
};
