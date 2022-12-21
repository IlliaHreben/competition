/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { AutoSizer, Column, Table, InfiniteLoader } from 'react-virtualized';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import { withStyles } from '@mui/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TableCell, Stack, Paper, IconButton } from '@mui/material';

import { formatISODate } from 'utils/datetime';
import { listCards, deleteCard, supplementListCards } from 'actions/cards';
import { showSuccess } from 'actions/errors';
import SettingsPopover from 'components/ui-components/settings-popover';
import Modal from 'components/ui-components/modal';
import EditCardModal from 'components/ui-components/edit-card-modal.js';
import TableHeader from 'components/ui-components/table-header';

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important'
      }),

      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined
      })
    }
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: 'initial'
  }
});

function mapState(state) {
  return {
    cards: state.cards.list,
    meta: state.cards.listMeta,
    active: state.competitions.active
  };
}
const dumpCard = (card, handleClickSettings) => {
  const { club, coach } = card.linked.fighter.linked;
  return {
    fullName: `${card.linked.fighter.lastName} ${card.linked.fighter.name}`,
    sex: card.linked.fighter.sex,
    settlement: club.linked.settlement.name,
    clubName: club.name,
    coachFullName: `${coach.name} ${coach.lastName}`,
    age: card.age,
    birthDate: formatISODate(card.birthDate),
    weight: card.weight,
    group: card.group || ' ',
    section: card.linked.category?.linked?.section?.name,
    settings: (
      <IconButton onClick={(e) => handleClickSettings(e, card)}>
        <MoreVertIcon />
      </IconButton>
    )
  };
};

const columns = [
  {
    width: 240,
    label: 'Full name',
    dataKey: 'fullName'
  },
  {
    width: 65,
    label: 'Sex',
    dataKey: 'sex'
  },
  {
    width: 170,
    label: 'City',
    dataKey: 'settlement'
  },
  {
    width: 210,
    label: 'Club',
    dataKey: 'clubName'
  },
  {
    width: 150,
    label: 'Coach',
    dataKey: 'coachFullName'
  },
  {
    width: 60,
    label: 'Age',
    dataKey: 'age',
    numeric: true
  },
  {
    width: 90,
    label: 'Birthday',
    dataKey: 'birthDate'
  },
  {
    width: 80,
    label: 'Weight',
    dataKey: 'weight',
    numeric: true
  },
  {
    width: 70,
    label: 'Group',
    dataKey: 'group'
  },
  {
    width: 120,
    label: 'Section',
    dataKey: 'section'
  },
  {
    width: 50,
    label: '',
    dataKey: 'settings',
    padding: 'checkbox'
  }
];

export default withStyles(styles)(function CardsTable(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Object.fromEntries(new URLSearchParams(location.search)));

  const getRowClassName = ({ index }) => {
    const { classes } = props;

    return `${classes.tableRow} ${classes.flexContainer}`;
  };

  const cellRenderer = ({ cellData, columnIndex }) => {
    return (
      <TableCell
        component='div'
        sx={{
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}
        variant='body'
        style={{ height: 48 }}
        align={columnIndex != null && columns[columnIndex].numeric ? 'right' : 'left'}
        padding={columns[columnIndex].padding}
      >
        {cellData}
      </TableCell>
    );
  };

  const headerRenderer = ({ label, columnIndex }) => {
    return (
      <TableCell
        component='div'
        sx={{
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          flex: 1
        }}
        variant='head'
        style={{ height: 48 }}
        align={columns[columnIndex].numeric ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  const { cards, active, meta } = useSelector(mapState);

  useEffect(() => {
    if (!active) return;
    const query = Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    navigate(`?${query}`, { replace: true });
    dispatch(
      listCards({
        limit: 30,
        competitionId: active.id,
        include: ['category', 'coach', 'club', 'fighter'],
        ...filters
      })
    );
  }, [filters, active, dispatch, navigate]);

  const loadMoreRows = () => {
    return dispatch(
      supplementListCards({
        offset: meta.offset + meta.limit,
        limit: meta.limit,
        competitionId: active.id,
        include: ['category', 'coach', 'club', 'fighter'],
        ...filters
      })
    );
  };

  const [anchor, setAnchor] = useState(null);
  const handleClickSettings = (event, card) => {
    setAnchor({ element: event.currentTarget, card });
  };
  const handleCloseSettings = () => {
    setAnchor(null);
  };

  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const handleChangeStatusDeleteModal = () => {
    setDeleteModalStatus(!deleteModalStatus);
  };
  const handleDeleteCard = () => {
    dispatch(
      deleteCard(anchor.card.id, () => dispatch(showSuccess('Card was successfully deleted.')))
    );
    handleChangeStatusDeleteModal();
    handleCloseSettings();
  };

  const [editModalStatus, setEditModalStatus] = useState(false);
  const handleChangeStatusEditModal = () => setEditModalStatus((prevState) => !prevState);

  const handleCloseEditModal = () => {
    handleChangeStatusEditModal();
    handleCloseSettings();
  };
  const handleConfirmEditModal = () => {
    handleChangeStatusEditModal();
    handleCloseSettings();
  };

  return (
    <Stack>
      <Modal
        title={'Do you really want to delete the card?'}
        open={deleteModalStatus}
        handleClose={handleChangeStatusDeleteModal}
        handleConfirm={handleDeleteCard}
      >
        This action can&#39;t be reverted.{'\n'}
        Category related to this card will be recalculated.
      </Modal>
      <EditCardModal
        open={editModalStatus}
        handleClose={handleCloseEditModal}
        handleConfirm={handleConfirmEditModal}
        card={anchor?.card}
      />
      <Paper
        style={{
          height: '100%',
          width: '1280px',
          minWidth: '1280px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TableHeader
          onChange={(current) => setFilters((prev) => ({ ...prev, ...current }))}
          initiator='cards'
          filters={filters}
        />
        <SettingsPopover
          anchorEl={anchor?.element}
          handleEdit={handleChangeStatusEditModal}
          handleDelete={handleChangeStatusDeleteModal}
          handleClose={handleCloseSettings}
        />
        <div style={{ flexGrow: 1 }}>
          <InfiniteLoader
            isRowLoaded={({ index }) => !!cards[index]}
            loadMoreRows={loadMoreRows}
            rowCount={meta.filteredCount}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ height, width }) => (
                  <Table
                    ref={registerChild}
                    height={height}
                    width={width}
                    rowHeight={48}
                    gridStyle={{
                      direction: 'row'
                    }}
                    headerHeight={48}
                    onRowsRendered={onRowsRendered}
                    rowCount={cards.length}
                    rowClassName={getRowClassName}
                    rowGetter={({ index }) => dumpCard(cards[index], handleClickSettings)}
                  >
                    {columns.map((column, index) => {
                      return (
                        <Column
                          key={column.dataKey}
                          headerRenderer={(headerProps) => {
                            return headerRenderer({
                              ...headerProps,
                              columnIndex: index
                            });
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            boxSizing: 'border-box'
                          }}
                          cellRenderer={cellRenderer}
                          {...column}
                        />
                      );
                    })}
                  </Table>
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </Paper>
    </Stack>
  );
});
