import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import styles from './graphics.module.css';
import CircularProgress from './CircularProgress';
import { CategorySettingsPopover, RowSettingsPopover } from './settings';

import FightTree from '../../ui-components/fight-tree';
import CategoryTable from '../../ui-components/category-table';
import TableHeader from '../../ui-components/table-header';
import HideAppBar from '../../ui-components/hide-bar.tsx';

import {
  concatToListCategories,
  listCategories
  // refreshCategories
} from '../../../actions/categories';
import { showSuccess } from '../../../actions/errors';
import { moveCard } from '../../../actions/cards';

function mapState(state) {
  return {
    competition: state.competitions.active,
    categories: state.categories.list,
    isLoading: state.categories.isLoading,
    meta: state.categories.listMeta
  };
}

const limit = 10;

export default function FightTrees() {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [node, setNode] = useState(null);
  const dispatch = useDispatch();
  const { competition, categories, meta, isLoading } = useSelector(mapState);
  const [selectedCardToMove, setSelectedCardToMove] = useState(null);
  const loadMoreRows = useCallback(() => {
    dispatch(
      (offset === 0 ? listCategories : concatToListCategories)({
        ...filters,
        competitionId: competition.id,
        offset,
        limit,
        include: ['cards', 'sections']
      })
    );
  }, [competition.id, dispatch, filters, offset]);

  const handleMoveCard = (categoryId) => {
    dispatch(
      moveCard({ id: selectedCardToMove.id, categoryId }, () => {
        dispatch(showSuccess('The card has been successfully moved.'));
        // dispatch(refreshCategories([categoryId, selectedCardToMove.categoryId]));
        setSelectedCardToMove(null);
        if (offset === 0) loadMoreRows();
        else setOffset(0);
      })
    );
  };

  useEffect(() => {
    if (isLoading) return;
    if (meta?.filteredCount - offset < limit) setHasMore(false);
  }, [meta.filteredCount, offset, isLoading]);

  useEffect(() => {
    if (!competition) return;
    loadMoreRows();
  }, [competition, loadMoreRows]);

  // settings
  const [anchorCategory, setAnchorCategory] = useState(null);
  const [anchorRow, setAnchorRow] = useState(null);

  const handleClickCategory = (e, category) => {
    setAnchorCategory({ element: e.currentTarget, category });
  };
  const handleClickCard = (e, card, category) => {
    setAnchorRow({ element: e.currentTarget, card, category });
  };

  const handleCloseCategorySettings = () => {
    setAnchorCategory(null);
  };
  const handleCloseCardSettings = () => {
    setAnchorRow(null);
  };

  const handleSelectToMove = () => {
    setSelectedCardToMove({ categoryId: anchorRow.category.id, id: anchorRow.card.id });
    dispatch(showSuccess('Selected. Please choose proper category'));
    handleCloseCardSettings();
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <CategorySettingsPopover
        anchor={anchorCategory}
        onClose={handleCloseCategorySettings}
        onMoveCard={handleMoveCard}
        selectedCardToMove={selectedCardToMove}
      />
      <RowSettingsPopover
        anchor={anchorRow}
        onClose={handleCloseCardSettings}
        handleSelectToMove={handleSelectToMove}
      />
      <div
        ref={(node) => {
          if (!node) return;
          setNode(node);
        }}
        id='scroll-root'
        style={{
          display: 'flex',
          // flexGrow: 1,
          // justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
          height: '100%'
        }}
      >
        <HideAppBar node={node}>
          <TableHeader
            onChange={(current) => {
              setFilters((prev) => ({ ...prev, ...current }));
              setOffset(0);
              setHasMore(true);
            }}
            initiator='graphics'
          />
        </HideAppBar>
        <InfiniteScroll
          dataLength={categories.length}
          next={() => setOffset(offset + limit)}
          hasMore={hasMore}
          scrollableTarget='scroll-root'
          loader={<CircularProgress />}
          style={{ overflow: 'hidden' }}
        >
          <DndProvider backend={HTML5Backend}>
            {categories.map((category) => (
              <Container key={category.id} maxWidth='xl'>
                <CategoryTable
                  category={category}
                  openCardSettings={handleClickCard}
                  openCategorySettings={handleClickCategory}
                />
                <div className={styles.treeContainer}>
                  {category.linked.fights.length > 0 ? (
                    <FightTree
                      key={category.id}
                      category={category}
                      setSelectedCardToMove={setSelectedCardToMove}
                    />
                  ) : (
                    <Box sx={{ mt: 1, mb: 1 }} />
                  )}
                </div>
              </Container>
            ))}
          </DndProvider>
        </InfiniteScroll>
      </div>
    </div>
  );
}
