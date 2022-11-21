import PropTypes from 'prop-types';
import LIVR from 'livr';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Select, MenuItem, Chip, Checkbox, ListItemText } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
// import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Modal from '../../../../ui-components/modal';
import { updateFightFormula, createFightFormula } from '../../../../../actions/fight-formulas';
import { list as listSections } from '../../../../../actions/sections';
import { showSuccess, showError } from '../../../../../actions/errors';
import { formatTimeToText, formatTime } from '../../../../../utils/datetime';

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
  },
  noLabel: {
    // marginTop: theme.spacing(3)
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

const validationRules = {
  sectionId: ['required', 'uuid'],
  weightFrom: ['required', 'positive_decimal'],
  weightTo: ['required', 'positive_decimal', { bigger_than: 'weightFrom' }],
  ageFrom: ['required', 'positive_decimal'],
  ageTo: ['required', 'positive_decimal', { bigger_than: 'weightFrom' }],
  degree: ['required', 'positive_decimal'],
  sex: ['required', { one_of: ['man', 'woman'] }],
  group: [{ one_of: ['A', 'B', null] }],

  roundCount: ['required', 'positive_integer', { number_between: [1, 12] }],
  roundTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
  breakTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }]
};

const validator = new LIVR.Validator(validationRules);

const formatFF = (ff) => ({
  ...ff,
  section: ff.section ? [ff.section] : [],
  degree: ff.degree ? [ff.degree] : [],
  group: ff.group ? [ff.group] : [],
  sex: ff.sex ? [ff.sex] : [],
  roundCount: ff.roundCount || ''
});

export default function CreateFightFormula({ open, handleClose, fightFormulaData = {} }) {
  const isUpdate = !!fightFormulaData.id;
  const classes = useStyles();
  const { errors: fetchErrors, competition, sections } = useSelector(mapStateToProps);
  const [fightFormula, setFightFormula] = useState(formatFF(fightFormulaData));
  console.log('+'.repeat(50)); // !nocommit
  console.log(fightFormula);
  console.log('+'.repeat(50));
  const [, /* errors */ setErrors] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    // validate(value, field);
    setFightFormula((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (fetchErrors) {
      Object.values(fetchErrors).map((error) => dispatch(showError(error)));
      // dispatch(deleteError('data'));
    }
  }, [dispatch, fetchErrors]);

  const handleConfirm = () => {
    const action = isUpdate ? updateFightFormula : createFightFormula;
    const data = isUpdate ? fightFormula : { competitionId: competition.id, ...fightFormula };

    dispatch(
      action(data, () => {
        dispatch(listSections({ competitionId: competition.id }));
        dispatch(
          showSuccess(`Fight formula has been successfully ${isUpdate ? 'updated' : 'created'}.`)
        );
        handleClose();
      })
    );
  };

  const validate = () => {
    const validData = validator.validate(fightFormula);
    if (validData) {
      setFightFormula(validData);
      return;
    }

    setErrors(validator.getErrors());
  };

  useEffect(validate, [fightFormula]);

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
      title='Create fight formula'
      contentProps={{ sx: { pr: 2, pl: 2, display: 'flex', flexDirection: 'column' } }}
      fullWidth
    >
      <FormControl sx={{ mb: 1, mt: 1 }}>
        <InputLabel id='demo-multiple-chip-label'>Sections</InputLabel>
        <Select
          // labelId='demo-mutiple-checkbox-label'
          // id='demo-mutiple-checkbox'
          multiple
          value={fightFormula.section}
          onChange={(e) => handleChange(e, 'section')}
          input={<OutlinedInput id='select-multiple-chip' label='Sections' />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          // MenuProps={MenuProps}
        >
          {sections.map(({ name }) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={fightFormula.section?.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction='row' spacing={2} sx={{ pt: 1 }}>
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

      <Stack direction='row' spacing={2} sx={{ pt: 1 }}>
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
    </Modal>
  );
}
