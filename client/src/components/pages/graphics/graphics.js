import { useState, useEffect } from 'react';
import FightTree from '../../ui-components/fight-tree';
import CategoryTable from '../../ui-components/category-table';
import api from '../../../api-singleton';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CircularProgress, Box } from '@mui/material';
import Container from '@mui/material/Container';

import styles from './graphics.module.css';
import { useSelector } from 'react-redux';

function mapStateToProps (state) {
    return {
        competition: state.competitions.active
    };
}

export default function FightTrees () {
    const [ graphics, setGraphics ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ hasMore, setHasMore ] = useState(true);
    const limit = 10;

    const { competition } = useSelector(mapStateToProps);

    useEffect(() => {
        async function fetchGraphic () {
        // const categoryId = 'e321c627-b053-417d-a710-accefb814e85';
        // const { data } = await api.categories.show(categoryId);
        // setGraphics([ data ]);
        // setHasMore(false);
            const { data } = await api.categories.list({
                competitionId : competition.id,
                offset,
                limit,
                include       : [ 'cards', 'sections' ]
            });

            if (data.length < limit) return setHasMore(false);

            setGraphics(graphics.concat(data));
        }

        if (competition) fetchGraphic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ competition, offset ]);

    return (
        <div id="scroll-root" style={{ height: '100%', overflow: 'auto' }}>
            <InfiniteScroll
                dataLength={graphics.length}
                next={() => setOffset(offset + limit)}
                hasMore={hasMore}
                scrollableTarget="scroll-root"
                loader={<CircularProgress />}
            >
                {graphics.map((category) => (
                    <Container key={category.id} maxWidth="xl">
                        <CategoryTable category={category} />
                        <div className={styles.treeContainer}>
                            {category.linked.fights.length > 0
                                ? <FightTree key={category.id} category={category} />
                                : <Box sx= {{ mt: 1, mb: 1 }} />
                            }
                        </div>
                    </Container>
                ))}
            </InfiniteScroll>
        </div>
    );
}
