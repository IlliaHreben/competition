import PropTypes from 'prop-types';
import LIVR from 'livr';

import { Select, MenuItem, Chip, Checkbox, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Input from '@mui/material/Input';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../../../ui-components/modal';
import { updateFightFormula, createFightFormula } from '../../../../../actions/fight-formulas';
import { list as listSections } from '../../../../../actions/sections';
import { showSuccess, showError } from '../../../../../actions/errors';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
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
    marginTop: theme.spacing(3)
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
  sex: ['required', { one_of: ['man', 'woman'] }],
  ageFrom: ['required', 'positive_decimal'],
  ageTo: ['required', 'positive_decimal', { bigger_than: 'weightFrom' }],
  degree: ['required', 'positive_decimal'],
  group: [{ one_of: ['A', 'B', null] }],

  roundCount: ['required', 'positive_integer', { number_between: [1, 12] }],
  roundTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }],
  breakTime: ['required', 'positive_integer', { number_between: [1, 60 * 60] }]
};

const validator = new LIVR.AsyncValidator(validationRules);

export default function CreateFightFormula({ open, handleClose, fightFormulaData = {} }) {
  const isUpdate = !!fightFormulaData.id;
  const classes = useStyles();
  const { errors: fetchErrors, competition, sections } = useSelector(mapStateToProps);
  const [fightFormula, setFightFormula] = useState(fightFormulaData);
  const [, /* errors */ setErrors] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e, field) => {
    const value = e.target.value;

    // validate(value, field);
    setFightFormula((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (fetchErrors) {
      fetchErrors.map((error) => dispatch(showError(error)));
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
      title='Create category'
      fullWidth
    >
      <Select
        labelId='demo-mutiple-checkbox-label'
        id='demo-mutiple-checkbox'
        multiple
        value={fightFormula.section}
        onChange={(e) => handleChange(e, 'section')}
        input={<Input id='select-multiple-chip' />}
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
            <Checkbox checked={fightFormula.section.includes(name)} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
      <Select value={fightFormula.sex} label='Sex' onChange={(e) => handleChange(e, 'sex')}>
        <MenuItem value={'man'}>Man</MenuItem>
        <MenuItem value={'woman'}>Woman</MenuItem>
      </Select>
      <Select value={fightFormula.group} label='Group' onChange={(e) => handleChange(e, 'group')}>
        <MenuItem value={'A'}>A</MenuItem>
        <MenuItem value={'B'}>B</MenuItem>
      </Select>
    </Modal>
  );
}
