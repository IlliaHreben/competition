import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import useConstant from 'use-constant';
import { Box, IconButton, Collapse } from '@mui/material';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { visuallyHidden } from '@mui/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { list as listFightFormulas } from '../../../../../actions/fight-formulas';
// import { showSuccess } from '../../../../actions/errors';
import SettingsPopover from '../../../../ui-components/settings-popover';
// import Modal from '../../../ui-components/modal';

import styles from '../../list.module.css';

function createData({ id, linked, weightFrom, weightTo, sex, ageFrom, ageTo, degree, group }) {
  return {
    id,
    section: linked.section.name,
    weightFrom,
    weightTo,
    sex,
    ageFrom,
    ageTo,
    degree,
    group
  };
}

const headCells = [
  { id: 'settings', allowSort: false, label: '', disablePadding: true },
  { id: 'section', allowSort: true, label: 'Section' },
  { id: 'weightFrom', allowSort: true, label: ' Weight from' },
  { id: 'weightTo', allowSort: true, label: 'Weight to' },
  { id: 'ageFrom', allowSort: true, label: 'Age from' },
  { id: 'ageTo', allowSort: true, label: 'Age to' },
  { id: 'sex', allowSort: true, label: 'Sex' },
  { id: 'group', allowSort: true, label: 'Group' },
  { id: 'degree', allowSort: true, label: 'Degree' }
];

function EnhancedTableHead(props) {
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

const EnhancedTableToolbar = (props) => {
  const { handleClickCreate } = props;

  return (
    <Toolbar
      className={styles.toolbar}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Button
          sx={{ marginRight: '20px' }}
          variant='contained'
          size='large'
          onClick={handleClickCreate}
        >
          create
        </Button>
      </Box>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClickCreate: PropTypes.func.isRequired
};

function group(items, groupBy = []) {
  const groups = items.reduce((acc, item) => {
    const group = groupBy.map((key) => item[key]).join('-');
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});

  return Object.values(groups);
}

/**
 * Returns a Map of the fight formulas with accumulated formula as a key. The distinct values will be joined by ', '.
 * @param {Array} groupedFightFormulas - array of arrays already grouped by some criteria
 * @param {Array} groupBy - array of keys to be used in accumulation
 * @example
 * const groupedFightFormulas = [
 *  [ { name: 'A', age: 1, lastName: 'X' }, { name: 'A', age: 1, lastName: 'Y'  } ],
 *  [ { name: 'B', age: 2, lastName: 'Y' }, { name: 'B', age: 2, lastName: 'Z'  } ],
 *  ];
 * const groupBy = ['name', 'age', 'lastName'];
 * const result = groupFightFormulas(groupedFightFormulas, groupBy);
 * // result = {
 * //  { name: 'A', age: 1, lastName: 'X, Y' },: [ { name: 'A', age: 1, lastName: 'X' }, { name: 'A', age: 1, lastName: 'Y'  } ],
 * //  { name: 'B', age: 2, lastName: 'Y, Z' },: [ { name: 'B', age: 2, lastName: 'X' }, { name: 'B', age: 2, lastName: 'Y'  } ],
 * // }
 */
function extractCommonFightFormula(groupedFightFormulas, groupBy) {
  const commonSection = new Map();
  groupedFightFormulas.forEach((group) => {
    const initial = groupBy.reduce((acc, key) => ({ ...acc, [key]: new Set() }), {});
    group.forEach((ff) => {
      groupBy.forEach((key) => {
        initial[key].add(ff[key]);
      });
    });
    Object.entries(initial).forEach(([key, value]) => (initial[key] = [...value].join(', ')));

    commonSection.set(initial, group);
    console.log('='.repeat(50)); // !nocommit
    console.log(group);
    console.log('='.repeat(50));
  });

  return commonSection;
}

function FightFormulasList() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('section');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { competition, rows } = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const debouncedSearchFunction = useConstant(() =>
    debounce(() => {
      setLoading(false);
    }, 500)
  );

  const handleSearch = (e) => {
    setLoading(true);
    setSearch(e.target.value);
    debouncedSearchFunction();
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    if (loading) return;
    const params = {
      order,
      sort: orderBy,
      ...(search && { search })
    };

    dispatch(listFightFormulas({ competitionId: competition.id, include: 'section', ...params }));
  }, [competition.id, dispatch, loading, order, orderBy, search]);

  const [anchor, setAnchor] = useState(null);
  const handleClickSettings = (event, id) => {
    setAnchor({ element: event.currentTarget, id });
  };
  const handleCloseSettings = () => {
    setAnchor(null);
  };

  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const handleChangeStatusDeleteModal = () => {
    setDeleteModalStatus(!deleteModalStatus);
  };
  // const handleDeleteFightFormula = () => {
  //   dispatch(
  //     deleteFightFormula(anchor.id, () =>
  //       dispatch(showSuccess('Fight formula was successfully deleted.'))
  //     )
  //   );
  //   handleChangeStatusDeleteModal();
  //   handleCloseSettings();
  // };
  const groupBy = ['section', 'ageFrom', 'ageTo', 'weightFrom', 'weightTo'];
  const fightFormulas = [
    ...extractCommonFightFormula(group(rows.map(createData), groupBy), [
      'sex',
      'group',
      ...groupBy
    ]).entries()
  ];

  return (
    <Container className={styles.page}>
      {/* <Modal
        title={'Are you really want to delete the fight formula?'}
        open={deleteModalStatus}
        handleClose={handleChangeStatusDeleteModal}
        handleConfirm={handleDeleteFightFormula}
      >
        Are you sure you want delete fight formula?
      </Modal> */}
      <SettingsPopover
        anchorEl={anchor?.element}
        // handleEdit={() => navigate(`${anchor.id}/edit`)}
        handleDelete={handleChangeStatusDeleteModal}
        handleClose={handleCloseSettings}
      />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            handleChange={handleSearch}
            search={search}
            loading={loading}
            handleClickCreate={() => navigate('./create')}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'small'}>
              <EnhancedTableHead
                onRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
              />
              <TableBody>
                {fightFormulas.map(([headerFormula, formulas]) => {
                  return (
                    <Row
                      key={Object.values(headerFormula).join('-')}
                      row={headerFormula}
                      expands={formulas}
                      handleClickSettings={handleClickSettings}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

function Row({ handleClickSettings, row, expands }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width='24%' align='left'>
          {row.section}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.weightFrom}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.weightTo}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.ageFrom}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.ageTo}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.sex}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.group}
        </TableCell>
        <TableCell width='10%' align='left'>
          {row.degree}
        </TableCell>
      </TableRow>
      <TableRow key={`${row.id}-collapse`}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={9}
        >
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  {expands.map((expandedRow) => (
                    <TableRow key={expandedRow.id}>
                      <TableCell>
                        <IconButton size='small' onClick={(e) => handleClickSettings(e, row.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell width='24%' align='left'>
                        {row.section}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.weightFrom}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.weightTo}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.ageFrom}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.ageTo}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.sex}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.group}
                      </TableCell>
                      <TableCell width='10%' align='left'>
                        {row.degree}
                      </TableCell>
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

function mapStateToProps(state) {
  return {
    rows: state.fightFormulas.list,
    meta: state.fightFormulas.listMeta,
    errors: state.fightFormulas.errors,
    isLoading: state.fightFormulas.isLoading,
    competition: state.competitions.current
  };
}

export default FightFormulasList;
