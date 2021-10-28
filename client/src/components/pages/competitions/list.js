import { useEffect, useState }       from 'react';
import PropTypes                     from 'prop-types';
import debounce                      from 'lodash.debounce';
import useConstant                   from 'use-constant';

import Box                           from '@mui/material/Box';
import Container                     from '@mui/material/Container';
import Table                         from '@mui/material/Table';
import TableBody                     from '@mui/material/TableBody';
import TableCell                     from '@mui/material/TableCell';
import TableContainer                from '@mui/material/TableContainer';
import TableHead                     from '@mui/material/TableHead';
import TablePagination               from '@mui/material/TablePagination';
import TableRow                      from '@mui/material/TableRow';
import TableSortLabel                from '@mui/material/TableSortLabel';
import Toolbar                       from '@mui/material/Toolbar';
import Paper                         from '@mui/material/Paper';
import Button                        from '@mui/material/Button';
import SearchIcon                    from '@mui/icons-material/Search';
import TextField                     from '@mui/material/TextField';
import InputAdornment                from '@mui/material/InputAdornment';
import CircularProgress              from '@mui/material/CircularProgress';
import { visuallyHidden }            from '@mui/utils';

import api                           from '../../../api-singleton';
import { formatISODate }             from '../../../utils/datetime';

import styles                        from './list.module.css';

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
    {
        id             : 'name',
        disablePadding : true,
        allowSort      : true,
        label          : 'Name'
    },
    {
        id             : 'description',
        disablePadding : false,
        allowSort      : true,
        label          : 'Description'
    },
    {
        id             : 'startDate',
        disablePadding : false,
        allowSort      : true,
        label          : 'Start date'
    },
    {
        id             : 'endDate',
        disablePadding : false,
        allowSort      : true,
        label          : 'End date'
    },
    {
        id             : 'days',
        disablePadding : false,
        allowSort      : false,
        label          : 'Days'
    },
    {
        id             : 'fighters',
        disablePadding : false,
        allowSort      : false,
        label          : 'Fighters'
    },
    {
        id             : 'cards',
        disablePadding : false,
        allowSort      : false,
        label          : 'Cards'
    }
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
                                    size={24}
                                    thickness={4}
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

List.propTypes = {
    history  : PropTypes.object.isRequired,
    location : PropTypes.object.isRequired
};

export default function List ({ history, location }) {
    const [ order, setOrder ] = useState('desc');
    const [ orderBy, setOrderBy ] = useState('startDate');
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);
    const [ totalCount, setTotalCount ] = useState(0);
    const [ rows, setRows ] = useState([]);
    const [ search, setSearch ] = useState('');
    const [ loading, setLoading ] = useState(false);

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

    const requestData = async (params) => {
        if (!params) {
            params = {
                order,
                sort   : orderBy,
                limit  : rowsPerPage,
                offset : page * rowsPerPage,
                ...search && { search }
            };
        }

        const { data, meta } = await api.competitions.list(params);
        setTotalCount(meta.filteredCount);
        setRows(data.map(createData));
    };

    useEffect(
        () => (!loading) && requestData(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ order, orderBy, page, rowsPerPage, loading ]
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

    return (
        <Container className={styles.page}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar
                        handleChange={handleSearch}
                        search={search}
                        loading={loading}
                        handleClickCreate={() => history.push(`${location.pathname}/create`)}
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
                                {rows.map(row => {
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
                                            <TableCell width="7%" align="left">{row.cardsCount}</TableCell>
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
                        count={totalCount}
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
