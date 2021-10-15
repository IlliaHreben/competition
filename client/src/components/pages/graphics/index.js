import { useState, useEffect }       from 'react';
import FightTree                     from '../../ui-components/fight-tree';
import CategoryTable                 from '../../ui-components/category-table';
import api                           from '../../../api-singleton';

export default function FightTrees () {
    const [ graphics, setGraphics ] = useState([]);

    async function fetchGraphic () {
        const categoryId = 'e160dd5f-0904-43ab-aba7-623da2a578cd';
        const competitionId = 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb';
        const { data } = await api.categories.getList({ competitionId });
        // console.log('='.repeat(50)); // !nocommit
        // console.log(data);
        // console.log('='.repeat(50));
        setGraphics(data);
    }
    useEffect(() => {
        fetchGraphic();
    }, []);
    console.log('='.repeat(50)); // !nocommit
    console.log(graphics);
    console.log('='.repeat(50));
    return (
        <>
            {graphics.map((category) => (
                <>
                    <CategoryTable key={category.id} category={category}/>
                    <FightTree key={category.id} category={category} />
                </>
            ))}
        </>
    );
}
