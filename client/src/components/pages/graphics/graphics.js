import { useState }                  from 'react';
import FightTree                     from '../../ui-components/fight-tree';
import CategoryTable                 from '../../ui-components/category-table';
import api                           from '../../../api-singleton';
import InfiniteScroll                from 'react-infinite-scroll-component';

import CircularProgress              from '@mui/material/CircularProgress';

import styles                        from './graphics.module.css';

export default function FightTrees () {
    const [ graphics, setGraphics ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ hasMore, setHasMore ] = useState(true);
    const limit = 10;

    async function fetchGraphic ({ concat = false } = {}) {
        // const categoryId = 'e321c627-b053-417d-a710-accefb814e85';
        // const { data } = await api.categories.show(categoryId);
        // setGraphics([ data ]);
        // setHasMore(false);
        const competitionId = 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb';
        const { data } = await api.categories.getList({
            competitionId,
            offset,
            ...concat && { limit }
        });

        if (data.length < limit) return setHasMore(false);

        setGraphics(concat ? graphics.concat(data) : data);
        setOffset(offset + limit);
    }

    if (!graphics.length) fetchGraphic();

    return (
        <InfiniteScroll
            dataLength={graphics.length}
            next={() => fetchGraphic({ concat: true })}
            hasMore={hasMore}
            // scrollableTarget="scroll-container"
            loader={<CircularProgress />}
        >
            {graphics.map((category) => (
                <>
                    <CategoryTable key={category.id} category={category} />
                    <div className={styles.treeContainer}>
                        {category.linked.fights.length && <FightTree key={category.id} category={category} />}
                    </div>
                </>
            ))}
        </InfiniteScroll>
    );
}
