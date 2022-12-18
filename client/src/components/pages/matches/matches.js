import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import CircularProgress from '../../ui-components/circular-progress';
import FilterDrawer from '../../ui-components/filters-drawer';

import { objectFilter } from '../../../utils/common';
import CategoryTable from '../../ui-components/category-table';
import TableHeader from '../../ui-components/table-header';
import HideAppBar from '../../ui-components/hide-bar.tsx';

import { concatToListFights, listFights, clearFights } from '../../../actions/fights';

function mapState(state) {
  return {
    competition: state.competitions.active,
    fights: state.fights.list,
    isLoading: state.fights.isLoading,
    meta: state.fights.listMeta
  };
}

const limit = 50;

export default function FightTrees() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearFights());
    return () => dispatch(clearFights());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { competition, fights, meta, isLoading } = useSelector(mapState);

  const categories = fights.map((fight) => {
    const { category, firstCard, secondCard } = fight.linked;
    return {
      ...category,
      linked: { fights: [fight], cards: [firstCard, secondCard], ...category.linked }
    };
  });

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(Object.fromEntries(new URLSearchParams(location.search)));
  const [hideTables, setHideTables] = useState(
    new URLSearchParams(location.search).get('hideTables') === 'true'
  );

  const [node, setNode] = useState(null);

  const loadMoreRows = useCallback(() => {
    const loadFights = offset === 0 ? listFights : concatToListFights;
    dispatch(
      loadFights({
        ...filters,
        competitionId: competition.id,
        offset,
        limit,
        include: ['categoryWithSection', 'cardsWithFighterAndLinked']
      })
    );
  }, [competition.id, dispatch, filters, offset]);

  useEffect(() => {
    const query = new URLSearchParams(objectFilter({ ...filters, hideTables })).toString();

    navigate(`?${query}`, { replace: true });
  }, [filters, navigate, offset, hideTables]);

  useEffect(() => {
    if (isLoading) return;
    if (meta?.filteredCount - offset < limit) setHasMore(false);
  }, [meta.filteredCount, offset, isLoading]);

  useEffect(() => {
    if (!competition) return;
    loadMoreRows();
  }, [competition, loadMoreRows]);

  const [moreFiltersAnchor, setMoreFiltersAnchor] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setMoreFiltersAnchor(open);
  };

  const handleFilterChange = (current) => {
    setFilters((prev) => objectFilter({ ...prev, ...current }));
    setOffset(0);
    setHasMore(true);
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <FilterDrawer
        open={moreFiltersAnchor}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onChange={handleFilterChange}
        filters={filters}
        onHideTables={(status) => setHideTables(status)}
        hideTables={hideTables}
        disableEmptyCategories
      />
      <div
        ref={(node) => {
          if (!node) return;
          setNode(node);
        }}
        id='scroll-root'
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
          height: '100%'
        }}
      >
        <HideAppBar node={node}>
          <TableHeader onChange={handleFilterChange} initiator='graphics' filters={filters}>
            <Button variant='text' onClick={toggleDrawer(true)}>
              More
            </Button>
          </TableHeader>
        </HideAppBar>
        <InfiniteScroll
          dataLength={categories.length}
          next={() => setOffset(offset + limit)}
          hasMore={hasMore}
          scrollableTarget='scroll-root'
          loader={<CircularProgress />}
          style={{ overflow: 'hidden' }}
        >
          {categories.map((category) => (
            <Container key={category.linked.fights[0].id} maxWidth='xl'>
              <CategoryTable openTable={!hideTables} category={category} disableHeader />
            </Container>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}