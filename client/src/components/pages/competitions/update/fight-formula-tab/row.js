import { useState } from 'react';
import { IconButton, Collapse, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PropTypes } from 'prop-types';
import { styled } from '@mui/material/styles';

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const cells = [
  { key: 'section', props: { width: '20%', align: 'left' } },
  { key: 'roundCount', props: { width: '8%', padding: 'none', align: 'left' } },
  { key: 'roundTime', props: { width: '11%', align: 'left' } },
  { key: 'breakTime', props: { width: '11%', align: 'left' } },
  { key: 'weight', props: { width: '9%', align: 'left' } },
  { key: 'age', props: { width: '9%', align: 'left' } },
  { key: 'sex', props: { width: '12%', align: 'left' } },
  { key: 'group', props: { width: '7%', align: 'left', padding: 'none' } },
  { key: 'degree', props: { width: '7%', align: 'left', padding: 'none' } }
];

export default function Row({ handleClickSettings, row, expands }) {
  const [open, setOpen] = useState(false);

  const ArrowIcon = open ? KeyboardArrowUpIcon : KeyboardArrowDownIcon;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            <ArrowIcon />
          </IconButton>
        </TableCell>
        {cells.map(({ key, props }) => (
          <TableCell key={key} {...props}>
            {row[key]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={cells.length + 1}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table size='small'>
                <TableBody>
                  {expands.map((expandedRow) => (
                    <TableRow
                      key={expandedRow.id}
                      sx={{
                        backgroundColor: 'rgba(243, 243, 243, 1)',
                        height: open ? 'auto' : '0'
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size='small'
                          onClick={(e) => handleClickSettings(e, expandedRow.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      {cells.map(({ key, props }) => (
                        <TableCell key={key} {...props}>
                          {expandedRow[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  handleClickSettings: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
  expands: PropTypes.array.isRequired
};
