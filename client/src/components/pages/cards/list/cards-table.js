/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
// import { AutoSizer, Column, Table, InfiniteLoader } from 'react-virtualized';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Stack, Paper, IconButton, TableHead, Table, TableBody } from '@mui/material';

import { Row } from './row';
import { Header } from './header';
import { formatISODate } from 'utils/datetime';
import { listCards, deleteCard, supplementListCards } from 'actions/cards';
import { showSuccess } from 'actions/errors';
import SettingsPopover from 'components/ui-components/settings-popover';
import Modal from 'components/ui-components/modal';
import EditCardModal from 'components/ui-components/edit-card-modal.js';
import TableHeader from 'components/ui-components/table-header';

function mapState(state) {
  return {
    cards: state.cards.list,
    meta: state.cards.listMeta,
    active: state.competitions.active
  };
}
const dumpCard = (card, handleClickSettings) => {
  const { club, coach } = card?.linked.fighter.linked || {};
  return {
    id: card ? card.id : `${Math.random()}`,
    fullName: card && `${card.linked.fighter.lastName} ${card.linked.fighter.name}`,
    sex: card && card.linked.fighter.sex,
    settlement: card && club.linked.settlement.name,
    clubName: card && club.name,
    coachFullName: card && `${coach.name} ${coach.lastName}`,
    age: card && card.age,
    birthDate: card && formatISODate(card.birthDate),
    weight: card && card.weight,
    group: card && (card.group || '-'),
    section: card && card.linked.category?.linked?.section?.name,
    settings: (
      <IconButton onClick={(e) => handleClickSettings(e, card)}>
        <MoreVertIcon />
      </IconButton>
    )
  };
};

export default function CardsTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Object.fromEntries(new URLSearchParams(location.search)));

  const { cards, active, meta } = useSelector(mapState);

  const isItemLoaded = (index) => !!cards[index];

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

  const loadMoreRows = (start, stop) => {
    const offset = start;
    const limit = stop + 1 - start;
    dispatch(
      supplementListCards({
        offset,
        limit,
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
          width: '1400px',
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
        <Table sx={{ width: '100%', height: '100%' }}>
          <TableHead>
            <Header />
          </TableHead>
          <TableBody sx={{ width: '100%' }}>
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMoreRows}
              itemCount={meta.filteredCount}
              minimumBatchSize={30}
            >
              {({ onItemsRendered, ref }) => (
                <AutoSizer ref={ref}>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemSize={53}
                      itemCount={meta.filteredCount}
                      onItemsRendered={onItemsRendered}
                      // itemKey={(index) => cards[index].id}
                    >
                      {({ index, style }) => (
                        <Row data={dumpCard(cards[index], handleClickSettings)} style={style} />
                      )}
                    </List>
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
