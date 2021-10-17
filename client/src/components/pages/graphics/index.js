import { useState, useEffect }       from 'react';
import FightTree                     from '../../ui-components/fight-tree';
import CategoryTable                 from '../../ui-components/category-table';
import api                           from '../../../api-singleton';

export default function FightTrees () {
    const [ graphics, setGraphics ] = useState([]);

    async function fetchGraphic () {
        const categoryId = 'f45ca04f-d647-4c80-a12c-fb222495efaa';
        const { data } = await api.categories.show(categoryId);
        setGraphics([ data ]);
        // const competitionId = 'ae5c900d-5c51-4cd6-bb51-c3f5ab251ccb';
        // const { data } = await api.categories.getList({ competitionId });
        // setGraphics(data);
    }
    useEffect(() => {
        fetchGraphic();
    }, []);
    return (
        <>
            {graphics.map((category) => (
                <>
                    <CategoryTable key={category.id} category={category}/>
                    {category.linked.fights.length && <FightTree key={category.id} category={category} />}
                </>
            ))}
        </>
    );
}
