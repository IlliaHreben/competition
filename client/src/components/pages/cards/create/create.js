/* eslint-disable multiline-ternary */
/* eslint-disable jsx-a11y/alt-text */
import { Paper, Stack, Typography, Container, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import sorryImg from '../../../../assets/icons/sorry.png';
import { listClubs } from '../../../../actions/clubs';
import { listCoaches } from '../../../../actions/coaches';
import { createCard } from '../../../../actions/cards';
import { showSuccess } from '../../../../actions/errors';
// import { listSettlements } from '../../../../actions/settlements';
import { list as listSections } from '../../../../actions/sections';

import CardForm from '../../../ui-components/card-form';

function mapState (state) {
    return {
        active: state.competitions.active
    };
}

export default function CreateCard () {
    const [ cardData, setCardData ] = useState({});
    const dispatch = useDispatch();
    const { active } = useSelector(mapState);

    useEffect(() => { document.title = 'Create card'; }, []);

    useEffect(() => {
        if (!active) return;
        dispatch(listClubs({ competitionId: active.id, include: [ 'coaches', 'settlement' ] }));
        dispatch(listCoaches({ competitionId: active.id, include: [ 'clubs' ] }));
        dispatch(listSections({ competitionId: active.id }));
    }, [ active, dispatch ]);

    const handleOnClickCreateButton = () => {
        dispatch(createCard({
            competitionId : active.id,
            data          : {
                birthDate : cardData.birthDate,
                group     : cardData.group,
                sectionId : cardData.sectionId,
                weight    : cardData.weight,
                fighterId : cardData.fighterId
            }
        },
        () => {
            dispatch(showSuccess('Card has been successfully created'));
            // handleClose();
        }));
    };

    return (
        <div>
            {active
                ? (
                    <Paper sx={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px', p: 1.5 }}>
                        <CardForm onChange={setCardData} />
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleOnClickCreateButton}
                        >Create
                        </Button>
                    </Paper>
                ) : (
                    <Stack sx={{ alignItems: 'center' }}>
                        <Container sx={{ mt: 4, justifyContent: 'center', display: 'flex' }}>
                            <img src={sorryImg} width="400" />
                        </Container>
                        <Typography variant="h5">At first, you need to choose competition.</Typography>
                        <Typography variant="h5">Please, visit &#34;Competitions&#34; page to select your competition.</Typography>
                    </Stack>
                )
            }

        </div>
    );
}
