import PropTypes from 'prop-types';
import { Popover, List, ListItem, ListItemIcon, ListItemButton, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

SettingsPopover.propTypes = {
  anchorEl: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  handleActivate: PropTypes.func,
  extraSettings: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      onClick: PropTypes.func.isRequired,
      text: PropTypes.object.isRequired
    }).isRequired
  )
};

export default function SettingsPopover({
  anchorEl,
  handleClose,
  handleEdit,
  handleDelete,
  handleActivate,
  extraSettings = []
}) {
  const settingsList = [];
  if (handleActivate)
    settingsList.push({
      icon: <CheckIcon fontSize={'small'} />,
      onClick: handleActivate,
      text: { primary: 'Activate' }
    });
  if (handleEdit)
    settingsList.push({
      icon: <EditIcon fontSize={'small'} />,
      onClick: handleEdit,
      text: { primary: 'Edit' }
    });
  if (handleDelete)
    settingsList.push({
      icon: <DeleteIcon sx={{ color: 'rgb(254 6 5/ 0.7);' }} fontSize={'small'} />,
      onClick: handleDelete,
      text: { sx: { color: 'rgb(254 6 5/ 0.7);' }, primary: 'Delete' }
    });
  settingsList.push(...extraSettings);

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <List sx={{ p: 0 }}>
        {settingsList.map(({ text, icon, onClick, ...props }) => (
          <ListItem disablePadding key={text.primary}>
            <ListItemButton sx={{ pt: 0.5, pb: 0.5 }} onClick={onClick} {...props}>
              <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
              <ListItemText {...text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}
