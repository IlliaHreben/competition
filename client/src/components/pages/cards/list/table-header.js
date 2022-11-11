import { TextField, Autocomplete, Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropTypes } from 'prop-types';

import { listClubs } from '../../../../actions/clubs';
import { listCoaches } from '../../../../actions/coaches';
import { listSettlements } from '../../../../actions/settlements';
import { list as listSections } from '../../../../actions/sections';
import debounce from 'lodash/debounce';

function mapState(state) {
  return {
    clubs: state.clubs.list,
    coaches: state.coaches.list,
    cards: state.cards.list,
    sections: state.sections.list,
    settlements: state.settlements.list,
    active: state.competitions.active
  };
}

TableHeader.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default function TableHeader({ onChange }) {
  const dispatch = useDispatch();

  const { clubs, coaches, cards, sections, settlements, active } = useSelector(mapState);

  useEffect(() => {
    if (!active) return;
    dispatch(listClubs({ competitionId: active.id, include: ['coaches', 'settlement'] }));
    dispatch(listCoaches({ competitionId: active.id, include: ['clubs'] }));
    dispatch(listSections({ competitionId: active.id }));
    dispatch(listSettlements({ competitionId: active.id }));
  }, [active, dispatch]);

  const handleSearchChange = useMemo(
    () =>
      debounce((e) => {
        onChange({ search: e.target.value });
      }, 300),
    // we can't recalculate cause debounce won't work
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Stack direction="row" spacing={2} sx={{ display: 'flex', m: 2 }}>
      <TextField size="small" sx={{ flexGrow: 2 }} label="Search" onChange={handleSearchChange} />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={coaches.filter((coach) =>
          cards.some((c) => c.linked.fighter.coachId === coach.id)
        )}
        sx={{ flexGrow: 4 }}
        getOptionLabel={({ name, lastName }) => `${lastName} ${name}`}
        renderInput={(params) => <TextField {...params} size="small" label="Coach" />}
        onChange={(e, coach) => onChange({ coachId: coach?.id })}
      />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={clubs.filter((club) => cards.some((c) => c.linked.fighter.clubId === club.id))}
        sx={{ flexGrow: 4 }}
        getOptionLabel={(club) => club.name}
        renderInput={(params) => <TextField {...params} size="small" label="Club" />}
        onChange={(e, club) => onChange({ clubId: club?.id })}
      />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={settlements}
        getOptionLabel={(s) => s.name}
        sx={{ flexGrow: 4 }}
        renderInput={(params) => <TextField {...params} size="small" label="City" />}
        onChange={(e, s) => onChange({ settlementId: s?.id || undefined })}
      />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={sections}
        sx={{ flexGrow: 3 }}
        getOptionLabel={(s) => s.name}
        renderInput={(params) => <TextField {...params} size="small" label="Section" />}
        onChange={(e, section) => onChange({ sectionId: section?.id })}
      />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={[
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'Without', value: null }
        ]}
        sx={{ flexGrow: 3 }}
        getOptionLabel={(s) => s.label}
        renderInput={(params) => <TextField {...params} size="small" label="Group" />}
        onChange={(e, group) => onChange({ group: group?.value })}
      />
      <Autocomplete
        includeInputInList
        blurOnSelect
        autoHighlight
        options={['man', 'woman']}
        sx={{ flexGrow: 3 }}
        renderInput={(params) => <TextField {...params} size="small" label="Sex" />}
        onChange={(e, sex) => onChange({ sex: sex || undefined })}
      />
    </Stack>
  );
}
