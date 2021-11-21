/* eslint-disable prefer-template */
import { useDispatch, useSelector }    from 'react-redux';
import PropTypes                       from 'prop-types';
import { useState }                    from 'react';
import { useParams }                   from 'react-router';
import without                         from 'lodash/without';
import {
    Checkbox, Paper, Tooltip, Toolbar, Typography,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Accordion, AccordionSummary,
    AccordionDetails, Button
} from '@mui/material';
import ExpandMoreIcon                  from '@mui/icons-material/ExpandMore';
import DeleteIcon                      from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import { deleteSection }               from '../../../../actions/sections';
import { bulkDelete, bulkCreate }      from '../../../../actions/categories';
import { showSuccess }                 from '../../../../actions/errors';

import Modal                           from '../../../ui-components/modal';
import CreateModal                     from '../../../ui-components/create-category-modal';
import CategoryRow                     from '../../../ui-components/category-row';

const aggregateBy = (array, by) => {
    return array.reduce((acc, c) => {
        const index = acc.findIndex(item => item[by] === c[by]);

        index !== -1
            ? acc[index].children.push(c)
            : acc.push({ [by]: c[by], children: [ c ] });
        return acc;
    }, []);
};

function createAccordionData (sections) {
    return sections.map(section => {
        return {
            id       : section.id,
            section  : section.name,
            children : aggregateBy(section.linked.categories, 'sex')
                ?.reduce((acc, c) => {
                    section.type === 'full'
                        ? acc.push({
                            sex      : c.sex,
                            header   : c.sex + '- group A',
                            group    : 'A',
                            children : c.children.filter(({ group }) => group === 'A')
                        }, {
                            sex      : c.sex,
                            header   : c.sex + '- group B',
                            group    : 'B',
                            children : c.children.filter(({ group }) => group === 'B')
                        })
                        : acc.push({
                            sex      : c.sex,
                            header   : c.sex,
                            children : c.children
                        });
                    return acc;
                }, [])
        };
    });
}

function mapStateToProps (state) {
    return {
        competition : state.competitions.current,
        sections    : state.sections.list,
        isLoading   : state.sections.isLoading
    };
}

export default function CategoriesTab () {
    const { sections } = useSelector(mapStateToProps);
    const [ deleteCandidate, setDeleteCandidate ] = useState(null);
    const [ openCreateModal, setStatusCreateModal ] = useState(false);
    const accordionData = createAccordionData(sections);

    const { id: competitionId } = useParams();

    const dispatch = useDispatch();

    const handleCreateCategory = () => {
        setStatusCreateModal(true);
    };

    const handleDeleteItem = (id) => {
        setDeleteCandidate(id);
    };
    const onConfirmModal = () => {
        dispatch(deleteSection(
            deleteCandidate,
            () => dispatch(showSuccess('Categories has been successfully deleted.')))
        );

        setDeleteCandidate(null);
    };

    return (
        <Paper sx={{ maxWidth: '500px', width: '100%' }}>
            <CreateModal
                open={openCreateModal}
                handleClose={() => setStatusCreateModal(false)}
                competitionId={competitionId}
            />
            <Modal
                open={!!deleteCandidate}
                handleConfirm={onConfirmModal}
                handleClose={() => setDeleteCandidate(null)}
            >You cannot revert this.
            </Modal>
            <Toolbar sx={{ pl: { sm: 2 }, pr: { sm: 1 } }} >
                <Typography
                    sx={{ flex: '1 1 100%', pl: 2 }}
                    variant="h6"
                    id="tableTitle"
                >Sections
                </Typography>

                <Button
                    onClick={handleCreateCategory}
                >Create
                </Button>
            </Toolbar>
            {accordionData.map(section => (
                <Accordion disableGutters key={section.id} TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                            '.MuiAccordionSummary-content' : { margin: 0, justifyContent: 'space-between' },
                            flexDirection                  : 'row-reverse'
                        }}
                    >
                        <Typography sx={{ ml: 3 }} alignSelf="center">{section.section}</Typography>
                        <Tooltip title="Delete">
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(section.id);
                            } }
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    </AccordionSummary>
                    <AccordionDetails
                        elevation={0}
                        square
                        sx={{ padding: 0, '.MuiAccordionDetails-root': { padding: 0 } }}
                    >
                        {section.children.map(categorySex => (
                            <Accordion
                                key={categorySex.header}
                                TransitionProps={{ unmountOnExit: true }}
                                // sx={{ border: 0, boxShadow: 'none' }}
                            >
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
                                        sectionId={section.id}
                                        sex={categorySex.sex}
                                        group={categorySex.group}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Paper>
    );
}

CategoriesTable.propTypes = {
    categories : PropTypes.array.isRequired,
    sectionId  : PropTypes.string.isRequired,
    sex        : PropTypes.string.isRequired,
    group      : PropTypes.string
};

function CategoriesTable ({ categories, sectionId, sex, group }) {
    const [ selected, setSelected ] = useState([]);
    const [ openModal, setStatusModal ] = useState(false);
    const [ categoriesFields, setCategoriesFields ] = useState([]);
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

    const handleChangeNewRow = (data, i) => {
        const _categoriesFields = [ ...categoriesFields ];
        _categoriesFields.splice(i, 1, data);
        setCategoriesFields(_categoriesFields);
    };

    const handleAddCategory = () => {
        setCategoriesFields([
            { ageFrom: '', ageTo: '', weightFrom: '', weightTo: '' },
            ...categoriesFields
        ]);
    };
    const handleSaveCategories = () => {
        dispatch(bulkCreate({
            sectionId,
            data: categoriesFields.map(c => ({ ...c, sex, group }))
        }, () => {
            dispatch(showSuccess('Categories has been successfully created.'));
            setCategoriesFields([]);
        }));
    };

    const isSelected = (name) => selected.includes(name);
    return (
        <>
            <Modal
                open={openModal}
                handleConfirm={onConfirmModal}
                handleClose={() => setStatusModal(false)}
            >You cannot revert this.
            </Modal>
            <Toolbar
                sx={{
                    pl : { sm: 2 },
                    pr : { xs: 1, sm: 1 },
                    ...(selected.length > 0 && { bgcolor: 'rgb(0 0 0 / 5%)' })
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

                {categoriesFields.length > 0 && (
                    <Tooltip title="Save">
                        <IconButton onClick={handleSaveCategories} >
                            <SaveIcon/>
                        </IconButton>
                    </Tooltip>
                )}
                {selected.length > 0
                    ? (
                        <Tooltip title="Delete">
                            <IconButton onClick={handleDeleteItems} >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                    : (
                        <Tooltip title="Add">
                            <IconButton onClick={handleAddCategory} >
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    )
                }

            </Toolbar>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table
                    sx={{ minWidth: 300 }}
                    aria-labelledby="tableTitle"
                >
                    <TableHead>
                        <TableRow sx={{ fontWeight: '700' }}>
                            <TableCell></TableCell>
                            <TableCell padding="none" colSpan={2} align="center">Age</TableCell>
                            <TableCell></TableCell>
                            <TableCell padding="none" colSpan={2} align="center">Weight</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
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
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell></TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoriesFields.map((data, i) => (
                            <CategoryRow key={i} data={data} onChange={data => handleChangeNewRow(data, i)}/>
                        ))}
                        {categories.map((row, index) => {
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
                                    <TableCell padding="checkbox" width={'15%'}>
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell width={'15%'}>{row.ageFrom}</TableCell>
                                    <TableCell width={'15%'}>{row.ageTo}</TableCell>
                                    <TableCell width={'10%'}></TableCell>
                                    <TableCell width={'15%'}>{row.weightFrom}</TableCell>
                                    <TableCell width={'15%'}>{row.weightTo}</TableCell>
                                    <TableCell width={'10%'}></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
