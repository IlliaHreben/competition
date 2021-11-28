import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import useConstant from 'use-constant';
import {
    Box, IconButton
} from '@mui/material';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { visuallyHidden } from '@mui/utils';

import { formatISODate } from '../../../utils/datetime';
import {
    list as listCompetitions,
    deleteCompetition,
    activateCompetition
} from '../../../actions/competitions';
import { showSuccess } from '../../../actions/errors';
import SettingsPopover from '../../ui-components/settings-popover';
import Modal from '../../ui-components/modal';

import styles from './list.module.css';

function createData ({ id, name, description, startDate, endDate, days, fightersCount, cardsCount }) {
    return {
        id,
        name,
        description,
        startDate : formatISODate(startDate),
        endDate   : formatISODate(endDate),
        days,
        fightersCount,
        cardsCount
    };
}

const headCells = [
    { id: 'name', allowSort: true, label: 'Name' },
    { id: 'description', allowSort: true, label: 'Description' },
    { id: 'startDate', allowSort: true, label: 'Start date' },
    { id: 'endDate', allowSort: true, label: 'End date' },
    { id: 'days', allowSort: false, label: 'Days' },
    { id: 'fighters', allowSort: false, label: 'Fighters' },
    { id: 'cards', allowSort: false, label: 'Cards' },
    { id: 'settings', allowSort: false, label: '', disablePadding: true }
];

function EnhancedTableHead (props) {
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
                        {
                            // eslint-disable-next-line operator-linebreak
                            headCell.allowSort ?
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id &&
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    }
                                </TableSortLabel>
                                : headCell.label
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort : PropTypes.func.isRequired,
    order         : PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
    orderBy       : PropTypes.string.isRequired
};

const EnhancedTableToolbar = (props) => {
    const { search, loading, handleChange, handleClickCreate } = props;

    return (
        <Toolbar className={styles.toolbar}
            sx={{
                pl : { sm: 2 },
                pr : { xs: 1, sm: 1 }
            }}
        >
            <TextField sx={{ marginLeft: '20px' }}
                hiddenLabel
                variant="standard"
                id="search"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {loading ? // eslint-disable-line operator-linebreak
                                <CircularProgress
                                    disableShrink
                                    size={18}
                                    thickness={5}
                                    sx={{ animationDuration: '550ms' }}
                                />
                                : <SearchIcon />}
                        </InputAdornment>
                    )
                }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button sx={{ marginRight: '20px' }}
                    variant="contained"
                    size="large"
                    onClick={handleClickCreate}
                >create
                </Button>
            </Box>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    search            : PropTypes.string.isRequired,
    loading           : PropTypes.bool.isRequired,
    handleChange      : PropTypes.func.isRequired,
    handleClickCreate : PropTypes.func.isRequired
};

function CompetitionsList () {
    const [ order, setOrder ] = useState('desc');
    const [ orderBy, setOrderBy ] = useState('startDate');
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);
    const [ search, setSearch ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => document.title = 'Competitions', []);

    const { rows, meta } = useSelector(mapStateToProps);
    const dispatch = useDispatch();

    const debouncedSearchFunction = useConstant(() => debounce(() => {
        setLoading(false);
    }, 500));

    const handleSearch = e => {
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
            sort   : orderBy,
            limit  : rowsPerPage,
            offset : page * rowsPerPage,
            ...search && { search }
        };

        dispatch(listCompetitions(params));
    }, [ dispatch, loading, order, orderBy, page, rowsPerPage, search ]);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [ anchor, setAnchor ] = useState(null);
    const handleClickSettings = (event, id) => {
        setAnchor({ element: event.currentTarget, id });
    };
    const handleCloseSettings = () => {
        setAnchor(null);
    };

    const [ deleteModalStatus, setDeleteModalStatus ] = useState(false);
    const handleChangeStatusDeleteModal = () => {
        setDeleteModalStatus(!deleteModalStatus);
    };
    const handleDeleteCompetition = () => {
        dispatch(deleteCompetition(
            anchor.id,
            () => dispatch(showSuccess('Competition was successfully deleted.'))
        ));
        handleChangeStatusDeleteModal();
        handleCloseSettings();
    };

    const handleActivateCompetition = () => {
        dispatch(activateCompetition(
            anchor.id,
            () => dispatch(showSuccess('Competition was successfully activated.'))
        ));
        handleCloseSettings();
    };

    // useState(() => showError(errors.))

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - meta.filteredCount) : 0;

    return (
        <Container className={styles.page}>
            <Modal
                title={'Are you really want to delete the competition?'}
                open={deleteModalStatus}
                handleClose={handleChangeStatusDeleteModal}
                handleConfirm={handleDeleteCompetition}
            >
                If you delete competition all categories and cards related to this competition will be deleted too.
                Also you can&#39;t delete competition if it in progress. Finish the competition first.
            </Modal>
            <SettingsPopover
                anchorEl={anchor?.element}
                handleEdit={() => navigate(`${anchor.id}/edit`)}
                handleDelete={handleChangeStatusDeleteModal}
                handleClose={handleCloseSettings}
                handleActivate={handleActivateCompetition}
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
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                onRequestSort={handleRequestSort}
                                order={order}
                                orderBy={orderBy}
                            />
                            <TableBody>
                                {rows.map(createData).map(row => {
                                    const labelId = `enhanced-table-checkbox-${row.id}`;

                                    return (
                                        <TableRow key={row.id} >
                                            <TableCell width="25%" align="left">{row.name}</TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.description}
                                            </TableCell>
                                            <TableCell width="11%" align="left">{row.startDate}</TableCell>
                                            <TableCell width="11%" align="left">{row.endDate}</TableCell>
                                            <TableCell width="7%" align="left">{row.days}</TableCell>
                                            <TableCell width="7%" align="left">{row.fightersCount}</TableCell>
                                            <TableCell width="7%" align="left" sx={{ pr: 0 }}>{row.cardsCount}</TableCell>
                                            <TableCell width="2%" align="right" sx={{ p: 0.5, pl: 0 }}>
                                                <IconButton onClick={e => handleClickSettings(e, row.id)}>
                                                    <MoreVertIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[ 5, 10, 25 ]}
                        component="div"
                        count={meta.filteredCount || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </Container>
    );
}

function mapStateToProps (state) {
    return {
        rows      : state.competitions.list,
        meta      : state.competitions.listMeta,
        errors    : state.competitions.errors,
        isLoading : state.competitions.isLoading
    };
}

export default (CompetitionsList);
