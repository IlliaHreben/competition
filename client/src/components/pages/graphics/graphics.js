import { useState, useEffect } from 'react';
import FightTree from '../../ui-components/fight-tree';
import CategoryTable from '../../ui-components/category-table';
import { concatToListCategories, listCategories } from '../../../actions/categories';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from './CircularProgress';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './graphics.module.css';
import { useDispatch, useSelector } from 'react-redux';
import TableHeader from '../../ui-components/table-header';
import HideAppBar from '../../ui-components/hide-bar.tsx';

function mapState(state) {
  return {
    competition: state.competitions.active,
    categories: state.categories.list,
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
  const { competition, categories, meta } = useSelector(mapState);

  useEffect(() => {
    if (offset >= meta?.filteredCount) setHasMore(false);
  }, [meta.filteredCount, offset]);

  useEffect(() => {
    if (!competition) return;
    dispatch(
      (offset === 0 ? listCategories : concatToListCategories)({
        ...filters,
        competitionId: competition.id,
        offset,
        limit,
        include: ['cards', 'sections']
      })
    );
  }, [competition, dispatch, filters, offset]);

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
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
                <CategoryTable category={category} />
                <div className={styles.treeContainer}>
                  {category.linked.fights.length > 0 ? (
                    <FightTree key={category.id} category={category} />
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
