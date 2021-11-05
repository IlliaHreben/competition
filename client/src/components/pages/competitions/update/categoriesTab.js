import { useDispatch, useSelector }    from 'react-redux';
import PropTypes                       from 'prop-types';
import { useState }                    from 'react';
import { useParams }                   from 'react-router';
import without                         from 'lodash/without';
import Checkbox                        from '@mui/material/Checkbox';
import Paper                           from '@mui/material/Paper';
import Tooltip                         from '@mui/material/Tooltip';
import Toolbar                         from '@mui/material/Toolbar';
import Typography                      from '@mui/material/Typography';
import IconButton                      from '@mui/material/IconButton';
import Table                           from '@mui/material/Table';
import TableBody                       from '@mui/material/TableBody';
import TableCell                       from '@mui/material/TableCell';
import TableContainer                  from '@mui/material/TableContainer';
import TableHead                       from '@mui/material/TableHead';
import TableRow                        from '@mui/material/TableRow';
import Accordion                       from '@mui/material/Accordion';
import AccordionSummary                from '@mui/material/AccordionSummary';
import AccordionDetails                from '@mui/material/AccordionDetails';
import ExpandMoreIcon                  from '@mui/icons-material/ExpandMore';
import DeleteIcon                      from '@mui/icons-material/Delete';

import { bulkDelete }                  from '../../../../actions/categories';
import { showSuccess }                 from '../../../../actions/errors';

import Modal                           from '../../../ui-components/modal';

const aggregateBy = (array, by) => {
    return array.reduce((acc, c) => {
        const index = acc.findIndex(item => item[by] === c[by]);

        index !== -1
            ? acc[index].children.push(c)
            : acc.push({ [by]: c[by], children: [ c ] });
        return acc;
    }, []);
};

function createAccordionData (categories) {
    const sections = aggregateBy(categories, 'section');
    for (const section of sections) {
        section.children = aggregateBy(section.children, 'sex')
            .reduce((acc, c) => {
                c.children[0]?.type === 'full'
                    ? acc.push({
                        header   : `${c.sex} - group A`,
                        children : c.children.filter(({ group }) => group === 'A')
                    }, {
                        header   : `${c.sex} - group B`,
                        children : c.children.filter(({ group }) => group === 'B')
                    })
                    : acc.push({
                        header   : `${c.sex}`,
                        children : c.children
                    });
                return acc;
            }, []);
    }
    return sections;
}

function mapStateToProps (state) {
    return {
        competition : state.competitions.current,
        categories  : state.categories.list,
        isLoading   : state.categories.isLoading
    };
}

export default function FightSpacesTab () {
    const { categories } = useSelector(mapStateToProps);
    const [ selected, setSelected ] = useState([]);
    const [ openModal, setStatusModal ] = useState(false);
    const accordionData = createAccordionData(categories);

    const { id: competitionId } = useParams();

    const dispatch = useDispatch();

    const handleClick = (e, section) => {
        setSelected(e.target.checked
            ? ([ ...selected, section ])
            : without(selected, section)
        );
    };

    const handleDeleteItems = () => {
        setStatusModal(true);
    };
    const onConfirmModal = () => {
        dispatch(bulkDelete(
            { competitionId, section: selected },
            showSuccess('Categories has been successfully deleted.'))
        );
        setStatusModal(false);
        setSelected([]);
    };

    const onSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = accordionData.map(c => c.section);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (name) => selected.includes(name);

    // const handleSave = () => {
    //     const payload = fightSpaces.filter(s => !s.disabled);
    //     dispatch(bulkUpdate(competitionId, payload,
    //         () => dispatch(showSuccess('Fight spaces has been successfully updated.'))
    //     ));
    // };
    return (
        <Paper sx={{ maxWidth: '500px', width: '100%' }}>
            <Modal
                open={openModal}
                handleConfirm={onConfirmModal}
                text="You cannot revert this."
                handleCancel={() => setStatusModal(false)}
            >
            </Modal>
            <Toolbar sx={{ pl: { sm: 2 } }} >
                <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < accordionData.length}
                    checked={accordionData.length > 0 && selected.length === accordionData.length}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                />
                {selected.length
                    ? (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >{selected.length} selected
                        </Typography>
                    )
                    : (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                        >Categories
                        </Typography>
                    )}

                <Tooltip title="Delete">
                    <IconButton disabled={!selected.length} onClick={handleDeleteItems}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
            {accordionData.map(categorySection => (
                <Accordion disableGutters key={categorySection.section} TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ '.MuiAccordionSummary-content': { margin: 0 } }}
                    >
                        <Checkbox
                            onClick={e => e.stopPropagation()}
                            color="primary"
                            sx={{ marginRight: '10px' }}
                            // indeterminate={selected.length > 0 && selected.length < categories.length}
                            checked={isSelected(categorySection.section)}
                            onChange={e => handleClick(e, categorySection.section)}
                            // sx={{ padding: 0 }}
                        />
                        <Typography alignSelf="center">{categorySection.section}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {categorySection.children.map(categorySex => (
                            <Accordion key = {categorySex.header} TransitionProps={{ unmountOnExit: true }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{categorySex.header}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <CategoriesTable
                                        categories={categorySex.children}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                </Accordion>

            ))}
            {/* <Button
                // disabled={disableUpdateButton}
                sx={{ margin: '7px', width: '97%' }}
                fullWidth
                variant="contained"
                size="large"
                loading={isLoading}
                // loadingPosition="start"
                // loadingIndicator="Loading..."
                onClick={handleSave}
            >Save
            </Button> */}
        </Paper>
    );
}

function createTableData (data) {
    return {
        id      : data.id,
        section : data.section,
        age     : `${data.ageFrom} - ${data.ageTo}`,
        weight  : `${data.weightFrom} - ${data.weightTo}`
    };
}

CategoriesTable.propTypes = {
    categories: PropTypes.array.isRequired
};

function CategoriesTable ({ categories }) {
    const [ selected, setSelected ] = useState([]);
    const [ openModal, setStatusModal ] = useState(false);

    const dispatch = useDispatch();

    const handleClick = (_, id) => {
        setSelected(selected.includes(id)
            ? without(selected, id)
            : ([ ...selected, id ]));
    };

    const handleDeleteItems = () => {
        setStatusModal(true);
    };
    const onConfirmModal = () => {
        dispatch(bulkDelete({ id: selected }, showSuccess('Categories has been successfully deleted.')));
        setStatusModal(false);
        setSelected([]);
    };

    const onSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories.map(c => c.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (name) => selected.includes(name);
    return (
        <>
            <Modal
                open={openModal}
                handleConfirm={onConfirmModal}
                text="You cannot revert this operation."
                handleCancel={() => setStatusModal(false)}
            >
            </Modal>
            <Toolbar
                sx={{
                    pl : { sm: 2 },
                    pr : { xs: 1, sm: 1 },
                    ...(selected.length > 0 && { bgcolor: 'grba(0,0,0,0.1)' })
                }}
            >
                {selected.length
                    ? (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {selected.length} selected
                        </Typography>
                    )
                    : (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            // component="div"
                        >
                            Categories
                        </Typography>
                    )}

                {selected.length > 0 &&
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDeleteItems} >
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table
                    sx={{ minWidth: 300 }}
                    aria-labelledby="tableTitle"
                >
                    <TableHead>
                        <TableRow sx={{ fontWeight: '700' }}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < categories.length}
                                    checked={categories.length > 0 && selected.length === categories.length}
                                    onChange={onSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts'
                                    }}
                                />
                            </TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Weight</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map(createTableData)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox" width={'5%'}>
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell width={'43%'}> {row.section} </TableCell>
                                        <TableCell width={'25%'}>{row.age}</TableCell>
                                        <TableCell width={'33%'}>{row.weight}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
