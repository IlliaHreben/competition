import { useState, useEffect }    from 'react';
import FightTree                  from '../../ui-components/fight-tree';
import FightTable                 from '../../ui-components/fight-table';
import api                        from '../../../api-singleton';

export default function FightTrees () {
    const [ graphics, setGraphics ] = useState([]);

    async function fetchGraphic () {
        const categoryId = 'e160dd5f-0904-43ab-aba7-623da2a578cd';
        const { data } = await api.categories.show(categoryId);

        setGraphics([ data ]);
    }
    useEffect(() => {
        fetchGraphic();
    }, []);
    return (
        <>
            {graphics.map((category) => (
                <>
                    <FightTable key={category.id} category={category}/>
                    <FightTree key={category.id} category={category} />
                </>
            ))}
        </>
    );
}
