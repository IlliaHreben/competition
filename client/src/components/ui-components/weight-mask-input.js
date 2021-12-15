import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import Input from '@mui/material/OutlinedInput';
import { InputLabel, InputAdornment } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const WeightMaskInput = forwardRef(function WeightMaskInput (props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="00[0]{.}{0}"
            lazy={false}
            placeholderChar='0'
            inputRef={ref}
            onAccept={(value) => onChange(value)}
            overwrite
        />
    );
});
WeightMaskInput.propTypes = {
    onChange: PropTypes.func.isRequired
};

MaskWeight.propTypes = {
    value      : PropTypes.string.isRequired,
    onChange   : PropTypes.func.isRequired,
    inputProps : PropTypes.object
};

export default function MaskWeight ({ value, onChange, inputProps = {}, ...props }) {
    return (
        <FormControl {...props} variant="outlined">
            <InputLabel htmlFor="weight-mask-input">Weight</InputLabel>
            <Input
                value={`${value}`}
                onChange={onChange}
                id="weight-mask-input"
                endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                inputProps={{
                    'aria-label': 'weight'
                }}
                label="Weight"
                inputComponent={WeightMaskInput}
                {...inputProps}
            />
        </FormControl>
    );
}
