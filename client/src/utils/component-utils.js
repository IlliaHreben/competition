import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';
import { PropTypes } from 'prop-types';

export default function ExpandIconButton({ open, onClick, iconProps, ...props }) {
  return (
    <IconButton onClick={onClick} {...props}>
      {open ? <ExpandLess {...iconProps} /> : <ExpandMore {...iconProps} />}
    </IconButton>
  );
}
ExpandIconButton.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func,
  iconProps: PropTypes.object
};
