import { Paper } from '@mui/material';
import { useState, useEffect } from 'react';

import CardForm from '../../../ui-components/card-form';

export default function CreateCard () {
    const [ cardData, setCardData ] = useState({});

    useEffect(() => document.title = 'Create card', []);

    return (
        <div>
            <Paper sx={{ display: 'flex', maxWidth: '1000px', p: 1.5 }}>
                <CardForm onChange={setCardData}/>
            </Paper>
        </div>
    );
}
