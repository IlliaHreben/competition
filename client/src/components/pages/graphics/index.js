import { useState, useEffect } from 'react';
import Graphic                 from '../../ui-components/graphic';

export default function Graphics () {
    const [ graphics, setGraphics ] = useState([]);

    async function fetchGraphic () {
        const categoryId = 'e160dd5f-0904-43ab-aba7-623da2a578cd';
        const res = await fetch(`/categories/calculate-fights?categoryId=${categoryId}`);
        const { data } = await res.json();

        setGraphics([ data ]);
    }
    useEffect(() => {
        fetchGraphic();
    }, []);
    return (
        <>
            {graphics.map((g, i) => (<Graphic key={i} fights={g} />))}
        </>
    );
}
