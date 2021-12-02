import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    TextField, Stack, IconButton, Typography,
    Popover, Box, SvgIcon
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactComponent as IconWeight } from '../../assets/icons/scales.svg';

ListFields.propTypes = {
    items             : PropTypes.array.isRequired,
    handleChangeItems : PropTypes.func.isRequired,
    nested            : PropTypes.bool,
    gap               : PropTypes.number.isRequired,
    sx                : PropTypes.object
};

export default function ListFields (props) {
    const { items, handleChangeItems, nested, gap, sx } = props;

    const [ focusStatus, setFocusStatus ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ anchorEl, setAnchorEl ] = useState(null);

    const handleErrorOnBlur = (i, key) => {
        deleteErrors(i, key);
        const message = getErrorMessage(i, key);
        if (message) setErrors([ ...errors, { index: i, key, message } ]);
    };

    const getErrorMessage = (i, key) => {
        const value = +items[i][key];
        const nextValueFrom = +items[i + 1]?.from;
        const prevValueTo = +items[i - 1]?.to;

        if (isNaN(value) || items[i][key] === '') {
            return 'Value must be a number.';
        } else if (key === 'from') { // can't be a gap
            if (!isNaN(prevValueTo) && prevValueTo !== 0 && +(value - prevValueTo).toFixed(1) !== gap) {
                return `Value must be a greater than previous by ${gap}`;
            } else if ((!isNaN(items[i].to) && items[i].to !== '') && value >= +items[i].to) {
                return 'Value must be lower then "to".';
            }
        } else if (key === 'to') {
            if (!isNaN(nextValueFrom) && nextValueFrom !== 0 && +(nextValueFrom - value).toFixed(1) !== gap) {
                return `Value must be a lower than next by ${gap}`;
            } else if ((!isNaN(items[i].from)) && value <= +items[i].from) {
                return 'Value must be greater then "from".';
            }
        }
    };

    const onChange = (e, i, key) => {
        const newItems = [ ...items ];
        newItems[i][key] = e.target.value.replaceAll(/[^{0-9}.]*/g, '');
        deleteErrors(i, key);

        handleChangeItems(newItems);
    };

    const deleteErrors = (i, key) => {
        const newErrors = errors.filter(e => !(e.index === i && (!key || e.key === key)));
        setErrors(newErrors);
    };

    const handleDelete = (i) => {
        const newItems = [ ...items ];
        newItems.splice(i, 1);
        deleteErrors(i);
        handleChangeItems(newItems);
    };

    const handleOpenPopover = (event, i) => {
        setAnchorEl({ target: event.currentTarget, i });
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleChangeNested = (nestedItems, i) => {
        const newItems = [ ...items ];
        newItems[i] = { ...newItems[i], nested: nestedItems };
        handleChangeItems(newItems);
    };

    return (
        <Stack sx={sx}>
            {!nested &&
                <Popover
                    sx={{ padding: '20px' }}
                    id={'popover'}
                    open={!!anchorEl}
                    anchorEl={anchorEl?.target}
                    onClose={handleClosePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'right' }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography>Weight categories</Typography>
                        <ListFields
                            items={anchorEl ? items[anchorEl.i].nested : []}
                            nested
                            handleChangeItems={nestedItems => handleChangeNested(nestedItems, anchorEl.i)}
                            gap={0.1}
                        />
                    </Box>
                </Popover>
            }
            {items.map((item, i) => (
                <Stack key={i} direction='row' sx={{ alignItems: 'flex-start' }} >
                    <Typography
                        variant='h7'
                        sx={{ width: '23px', mr: i < 9 ? 2.2 : 1, mt: '6px' }}
                    >{i + 1}.
                    </Typography>
                    <TextField
                        variant='standard'
                        value={items[i].from}
                        onChange={e => onChange(e, i, 'from')}
                        fullWidth
                        inputRef={ref => {
                            if (ref && i === items.length - 1 && focusStatus === 1) ref.focus();
                            setFocusStatus(false);
                        }}
                        error={errors.some(e => e.index === i && e.key === 'from')}
                        helperText={errors.find(e => e.index === i && e.key === 'from')?.message || ''}
                        onBlur={() => handleErrorOnBlur(i, 'from')}
                    >{item.from}
                    </TextField>
                    <Typography variant='h6' sx={{ mr: 2, ml: 2 }}>-</Typography>
                    <TextField
                        variant='standard'
                        value={items[i].to}
                        fullWidth
                        onChange={e => onChange(e, i, 'to')}
                        inputRef={ref => {
                            if (ref && i === items.length - 1 && focusStatus === 2) ref.focus();
                            setFocusStatus(false);
                        }}
                        error={errors.some(e => e.index === i && e.key === 'to')}
                        helperText={errors.find(e => e.index === i && e.key === 'to')?.message || ''}
                        onBlur={() => handleErrorOnBlur(i, 'to')}
                    >{item.to}
                    </TextField>
                    {!nested &&
                        <IconButton
                            size='medium'
                            aria-describedby={'popover'}
                            onClick={(e) => handleOpenPopover(e, i)}
                            sx={{ ml: 0 }}
                        >
                            <SvgIcon fontSize='small'><IconWeight style={{ fontSize: '5' }}/></SvgIcon>

                        </IconButton>
                    }
                    <IconButton
                        size='small'
                        aria-label='delete'
                        onClick={() => handleDelete(i)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            ))}
            <>
                <Stack
                    direction='row'
                    onClick={() => handleChangeItems([ ...items, { from: '', to: '', nested: [] } ])}
                >
                    <Typography variant='h7' sx={{ w: 2, mr: '29px', mb: '6px' }}></Typography>
                    <TextField variant='standard' fullWidth onClick={() => setFocusStatus(1)}/>
                    <Typography variant='h6' sx={{ mr: 2, ml: 2 }}>-</Typography>
                    <TextField variant='standard' fullWidth onClick={() => setFocusStatus(2)}></TextField>
                    <Box sx={{ width: '0px', mr: nested ? 4.5 : 8.75 }}/>
                </Stack>
                {/* <IconButton
                    aria-label='delete'
                    // onClick={() => props.deleteActor(props.id)}
                >
                    <DeleteIcon fontSize='small' />
                </IconButton> */}
            </>
        </Stack>
    );
};
