import { Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listClubs } from 'actions/clubs';
import { listCoaches } from 'actions/coaches';
import { createCard } from 'actions/cards';
import { showSuccess } from 'actions/errors';
import { list as listSections } from 'actions/sections';
import SelectCompetitionChecker from 'components/ui-components/select-competition-checker';

import CardForm from 'components/ui-components/card-form';

const mapState = (state) => ({
  active: state.competitions.active
});

export default function CreateCard() {
  const [cardData, setCardData] = useState({});
  const dispatch = useDispatch();
  const { active } = useSelector(mapState);

  useEffect(() => {
    document.title = 'Create card';
  }, []);

  useEffect(() => {
    if (!active) return;
    dispatch(listClubs({ competitionId: active.id, include: ['coaches', 'settlement'] }));
    dispatch(listCoaches({ competitionId: active.id, include: ['clubs'] }));
    dispatch(listSections({ competitionId: active.id }));
  }, [active, dispatch]);

  const handleOnClickCreateButton = () => {
    dispatch(
      createCard(
        {
          competitionId: active.id,
          data: {
            birthDate: cardData.birthDate,
            group: cardData.group,
            sectionId: cardData.sectionId,
            weight: cardData.weight,
            fighterId: cardData.fighterId
          }
        },
        () => {
          dispatch(showSuccess('Card has been successfully created'));
        }
      )
    );
  };

  return (
    <SelectCompetitionChecker>
      <div>
        <Paper sx={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px', p: 1.5 }}>
          <CardForm onChange={setCardData} />
          <Button variant='contained' sx={{ mt: 2 }} onClick={handleOnClickCreateButton}>
            Create
          </Button>
        </Paper>
      </div>
    </SelectCompetitionChecker>
  );
}
