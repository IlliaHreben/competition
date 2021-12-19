import { useState, useEffect } from 'react';
import FightTree from '../../ui-components/fight-tree';
import CategoryTable from '../../ui-components/category-table';
import api from '../../../api-singleton';
import { concatToListCategories } from '../../../actions/categories';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CircularProgress, Box } from '@mui/material';
import Container from '@mui/material/Container';

import styles from './graphics.module.css';
import { useDispatch, useSelector } from 'react-redux';

function mapState (state) {
    return {
        competition : state.competitions.active,
        categories  : state.categories.list,
        meta        : state.categories.listMeta
    };
}

const limit = 10;

export default function FightTrees () {
    // const [ graphics, setGraphics ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ hasMore, setHasMore ] = useState(true);
    const dispatch = useDispatch();
    const { competition, categories, meta } = useSelector(mapState);

    useEffect(() => {
        if (offset >= meta?.filteredCount) setHasMore(false);
    }, [ meta.filteredCount, offset ]);

    useEffect(() => {
        if (!competition) return;
        dispatch(concatToListCategories({
            competitionId : competition.id,
            offset,
            limit,
            include       : [ 'cards', 'sections' ]
        }));

        //     async function fetchGraphic () {
        //         const { data } = await api.categories.list({
        //             competitionId : competition.id,
        //             offset,
        //             limit,
        //             include       : [ 'cards', 'sections' ]
        //         });

        //         if (data.length < limit) return setHasMore(false);

        //         setGraphics(graphics.concat(data));
        //     }

    //     if (competition) fetchGraphic();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ competition, dispatch, offset ]);

    return (
        <div id="scroll-root" style={{
            display        : 'flex',
            flexGrow       : 1,
            justifyContent : 'center',
            overflow       : 'auto'
        }}
        >
            <InfiniteScroll
                dataLength={categories.length}
                next={() => setOffset(offset + limit)}
                hasMore={hasMore}
                scrollableTarget="scroll-root"
                loader={<CircularProgress />}
            >
                {categories.map((category) => (
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
