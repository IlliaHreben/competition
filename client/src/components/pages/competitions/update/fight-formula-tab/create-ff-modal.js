import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Select, MenuItem, Chip, Checkbox, ListItemText, Container, Divider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

import Modal from '../../../../ui-components/modal';
import {
  updateFightFormula,
  bulkCreateFightFormula,
  listFightFormulas
} from '../../../../../actions/fight-formulas';
import { showSuccess } from '../../../../../actions/errors';
import { formatTimeToText, formatTime } from '../../../../../utils/datetime';
import { prepareToSend, formatFF } from './utils';

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  }
}));

CreateFightFormula.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fightFormulaData: PropTypes.object
};

function mapStateToProps(state) {
  return {
    errors: state.categories.errors,
    competition: state.competitions.current,
    sections: state.sections.list
  };
}

export default function CreateFightFormula({ open, handleClose, fightFormulaData = {} }) {
  const isEdit = !!fightFormulaData.id;
  const classes = useStyles();
  const { competition, sections } = useSelector(mapStateToProps);
  const [fightFormula, setFightFormula] = useState(formatFF(fightFormulaData, sections));
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    const value = e?.target ? e.target.value : e;
    // validate(value, field);
    setFightFormula((prev) => ({ ...prev, [field]: value }));
  };

  // useEffect(() => {
  //   if (fetchErrors) {
  //     Object.values(fetchErrors).map((error) => dispatch(showError(error)));
  //     // dispatch(deleteError('data'));
  //   }
  // }, [dispatch, fetchErrors]);

  const handleConfirm = () => {
    const action = isEdit ? updateFightFormula : bulkCreateFightFormula;

    const formattedData = prepareToSend(fightFormula, sections);

    const data = isEdit ? formattedData : { competitionId: competition.id, data: formattedData };

    dispatch(
      action(data, () => {
        dispatch(listFightFormulas({ competitionId: competition.id }));
        dispatch(
          showSuccess(`Fight formula has been successfully ${isEdit ? 'updated' : 'created'}.`)
        );
        handleClose();
      })
    );
  };

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
      title='Create fight formula'
      disabled={!fightFormula.roundCount || !fightFormula.roundTime || !fightFormula.breakTime}
      contentProps={{ sx: { pr: 2, pl: 2, display: 'flex', flexDirection: 'column' } }}
      confirmButtonText={isEdit ? 'Save' : 'Create'}
      fullWidth
    >
      <FormControl sx={{ mb: 1, mt: 1 }}>
        <InputLabel>Sections</InputLabel>
        <Select
          multiple
          value={fightFormula.sectionId}
          onChange={(e) => handleChange(e, 'sectionId')}
          input={<OutlinedInput id='select-multiple-chip' label='Sections' />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={sections.find((s) => s.id === value).name}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
        >
          {sections.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              <Checkbox checked={fightFormula.sectionId?.includes(id)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction='row' spacing={2} sx={{ pt: 1, pb: 1, mb: 2 }}>
        <FormControl sx={{ flexGrow: 1, flexBasis: 0 }}>
          <InputLabel>Sex</InputLabel>
          <Select
            multiple
            value={fightFormula.sex}
            label='Sex'
            onChange={(e) => handleChange(e, 'sex')}
          >
            <MenuItem value={'man'}>Man</MenuItem>
            <MenuItem value={'woman'}>Woman</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flexGrow: 1, flexBasis: 0 }}>
          <InputLabel>Groups</InputLabel>
          <Select
            multiple
            value={fightFormula.group}
            label='Groups'
            onChange={(e) => handleChange(e, 'group')}
          >
            <MenuItem value={'A'}>A</MenuItem>
            <MenuItem value={'B'}>B</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flexGrow: 1, flexBasis: 0 }}>
          <InputLabel>Degrees</InputLabel>
          <Select
            multiple
            value={fightFormula.degree}
            label='Degrees'
            onChange={(e) => handleChange(e, 'degree')}
          >
            {[1, 2, 4, 8, 16, 32].map((degree) => (
              <MenuItem key={degree} value={degree}>
                {`1/${degree}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Divider>
        <Chip label={`Fight formula`} />
      </Divider>
      <Stack direction='row' spacing={2} sx={{ pt: 1, mt: 1, mb: 3 }}>
        <FormControl sx={{ flexGrow: 1, flexBasis: 0 }}>
          <InputLabel>Rounds</InputLabel>
          <Select
            value={fightFormula.roundCount || ''}
            label='Rounds'
            onChange={(e) => handleChange(e, 'roundCount')}
          >
            <MenuItem value={''}>Not set</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((rounds) => (
              <MenuItem key={rounds} value={rounds}>
                {`${rounds} rounds`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label='Round time'
          type='time'
          // defaultValue='02:00'
          value={formatTimeToText(fightFormula.roundTime)}
          InputLabelProps={{
            shrink: true
          }}
          onChange={(e) => handleChange(formatTime(e.target.value), 'roundTime')}
          sx={{ flexGrow: 1, flexBasis: 0 }}
          inputProps={{
            step: 300 // 5 min
          }}
        />
        <TextField
          label='Break time'
          type='time'
          // defaultValue='02:00'
          value={formatTimeToText(fightFormula.breakTime)}
          InputLabelProps={{
            shrink: true
          }}
          onChange={(e) => handleChange(formatTime(e.target.value), 'breakTime')}
          sx={{ flexGrow: 1, flexBasis: 0 }}
          inputProps={{
            step: 300 // 5 min
          }}
        />
      </Stack>
      <Divider>
        <Chip label={`Age: ${fightFormula.ageFrom || 1} - ${fightFormula.ageTo || '60+'}`} />
      </Divider>

      <Container sx={{ mt: 3, mb: 2 }}>
        <Slider
          getAriaLabel={() => 'Age'}
          value={[fightFormula.ageFrom || 1, fightFormula.ageTo || 100]}
          onChange={(e, [ageFrom, ageTo]) => {
            handleChange(ageFrom === 1 ? null : ageFrom, 'ageFrom');
            handleChange(ageTo === 100 ? null : ageTo, 'ageTo');
          }}
          valueLabelDisplay='auto'
          min={1}
          disableSwap
          marks={[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => ({
            value,
            label: value === 100 ? value + '+' : value
          }))}
        />
      </Container>
      <Divider>
        <Chip
          label={`Weight: ${fightFormula.weightFrom || '10'} - ${fightFormula.weightTo || '100+'}`}
        />
      </Divider>
      <Container>
        <Slider
          sx={{ mt: 3, mb: 2 }}
          getAriaLabel={() => 'Weight'}
          value={[fightFormula.weightFrom || 10, fightFormula.weightTo || 100]}
          onChange={(e, [weightFrom, weightTo]) => {
            handleChange(weightFrom === 10 ? null : weightFrom, 'weightFrom');
            handleChange(weightTo === 100 ? null : weightTo, 'weightTo');
          }}
          min={10}
          step={0.1}
          max={100}
          valueLabelDisplay='auto'
          disableSwap
          marks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100].map((value) => ({
            value,
            label: value === 100 ? value + '+' : value
          }))}
        />
      </Container>
    </Modal>
  );
}
