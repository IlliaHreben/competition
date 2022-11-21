import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Row from './row';
import EnhancedTableHead from './enhanced-table-head';

import { listFightFormulas, deleteFightFormula } from '../../../../../actions/fight-formulas';
import { showSuccess } from '../../../../../actions/errors';
import SettingsPopover from '../../../../ui-components/settings-popover';
import Modal from '../../../../ui-components/modal';

import styles from './fight-formulas.module.css';
import EnhancedTableToolbar from './enhanced-table-toolbar';
import { groupByCriteria, extractCommonFightFormula } from '../../../../../utils/grouping';
import CreateFightFormulaModal from './create-ff-modal';

function createData(ff) {
  return {
    id: ff.id,
    section: ff.linked.section.name,
    weight: ff.weightFrom + ' - ' + ff.weightTo,
    sex: ff.sex,
    age: ff.ageFrom + ' - ' + ff.ageTo,
    degree: ff.degree,
    group: ff.group,
    roundCount: ff.roundCount,
    roundTime: ff.roundTime / 60,
    breakTime: ff.breakTime
  };
}

function FightFormulasList() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('section');

  const { competition, rows } = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const params = {
      order,
      sort: orderBy
    };

    dispatch(listFightFormulas({ competitionId: competition.id, include: 'section', ...params }));
  }, [competition.id, dispatch, order, orderBy]);

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
  const handleDeleteFightFormula = () => {
    dispatch(
      deleteFightFormula(anchor.id, () =>
        dispatch(showSuccess('Fight formula was successfully deleted.'))
      )
    );
    handleChangeStatusDeleteModal();
    handleCloseSettings();
  };

  const [createModalStatus, setCreateModalStatus] = useState(false);
  const handleChangeStatusCreateModal = () => {
    setCreateModalStatus((prev) => !prev);
  };

  const groupBy = ['section', 'age', 'weight'];
  const fightFormulas = [
    ...extractCommonFightFormula(groupByCriteria(rows.map(createData), groupBy), [
      'sex',
      'group',
      'roundTime',
      'roundCount',
      'breakTime',
      ...groupBy
    ]).entries()
  ];

  return (
    <Container className={styles.page}>
      <Modal
        title={'Are you really want to delete the fight formula?'}
        open={deleteModalStatus}
        handleClose={handleChangeStatusDeleteModal}
        handleConfirm={handleDeleteFightFormula}
      >
        You cannot revert this operation.
      </Modal>
      <CreateFightFormulaModal
        open={createModalStatus}
        handleClose={handleChangeStatusCreateModal}
        handleConfirm={handleDeleteFightFormula}
      />
      <SettingsPopover
        anchorEl={anchor?.element}
        // handleEdit={() => navigate(`${anchor.id}/edit`)}
        handleDelete={handleChangeStatusDeleteModal}
        handleClose={handleCloseSettings}
      />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar handleClickCreate={handleChangeStatusCreateModal} />
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
