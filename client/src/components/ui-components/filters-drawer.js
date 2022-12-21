import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { PropTypes } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { list as listFightSpaces } from 'actions/fight-spaces';
import { useEffect } from 'react';

function mapState(state) {
  return {
    fightSpaces: state.fightSpaces.list,
    active: state.competitions.active
  };
}

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  filters: PropTypes.object,
  onHideTables: PropTypes.func.isRequired,
  hideTables: PropTypes.bool,
  disableEmptyCategories: PropTypes.bool
};

export default function FilterDrawer({
  open,
  onClose,
  onOpen,
  onChange,
  filters = {},
  onHideTables,
  hideTables,
  disableEmptyCategories
}) {
  const dispatch = useDispatch();
  const { active, fightSpaces } = useSelector(mapState);
  const handleChange = (values) => {
    onChange({ ...filters, ...values });
  };

  useEffect(() => {
    if (!active) return;
    dispatch(listFightSpaces(active.id));
  }, [active, dispatch]);

  return (
    <SwipeableDrawer anchor={'right'} open={open} onClose={onClose} onOpen={onOpen}>
      <Box sx={{ width: 250 }} role='presentation'>
        <List>
          <ListItem disablePadding>
            <ListItemButton dense onClick={(e) => onHideTables(e.target.checked)}>
              <ListItemIcon>
                <Switch
                  checked={
                    typeof hideTables === 'string' ? hideTables === 'true' : hideTables || false
                  }
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={'Collapse tables'} />
            </ListItemButton>
          </ListItem>
          {!disableEmptyCategories && (
            <ListItem disablePadding>
              <ListItemButton
                dense
                onClick={(e) => handleChange({ display: e.target.checked ? 'all' : 'filled' })}
              >
                <ListItemIcon>
                  <Switch checked={filters.display === 'all'} disableRipple />
                </ListItemIcon>
                <ListItemText primary={'Show empty categories'} />
              </ListItemButton>
            </ListItem>
          )}
          {fightSpaces.length && (
            <ListItem>
              <FormControl size='small' fullWidth>
                <InputLabel id='fight-space-select'>Fight space</InputLabel>
                <Select
                  labelId='fight-space-select'
                  label='Fight space'
                  value={filters.fightSpaceId || ''}
                  onChange={(e) => {
                    handleChange({ fightSpaceId: e.target.value });
                  }}
                >
                  <MenuItem value={''}>None</MenuItem>
                  {fightSpaces.map((fightSpace) => (
                    <MenuItem key={fightSpace.id} value={fightSpace.id}>
                      <ListItemText
                        primary={formatFightSpace(fightSpace)}
                        secondary={`Day ${fightSpace.competitionDay}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          )}
          <ListItem>
            <FormControl size='small' fullWidth>
              <InputLabel id='fight-count-select'>Fights count</InputLabel>
              <Select
                labelId='fight-count-select'
                multiple
                value={
                  Array.isArray(filters.fightsCount)
                    ? filters.fightsCount
                    : filters.fightsCount?.split(',') || []
                }
                onChange={(e) => {
                  handleChange({ fightsCount: e.target.value });
                }}
                input={<OutlinedInput label='Fights count' />}
              >
                {Array.from({ length: 65 }).map((_, count) => (
                  <MenuItem key={count} value={count}>
                    {count}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
}

function formatFightSpace(fightSpace) {
  const { type, orderNumber } = fightSpace;
  const formattedOrderNumber =
    type === 'ring' ? String.fromCharCode(64 + orderNumber) : orderNumber;
  return `${type.toUpperCase()} ${formattedOrderNumber}`;
}
