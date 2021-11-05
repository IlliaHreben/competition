import Button            from '@mui/material/Button';
import Dialog            from '@mui/material/Dialog';
import DialogActions     from '@mui/material/DialogActions';
import DialogContent     from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle       from '@mui/material/DialogTitle';
import useMediaQuery     from '@mui/material/useMediaQuery';
import { useTheme }      from '@mui/material/styles';
import PropTypes         from 'prop-types';

Modal.propTypes = {
    open          : PropTypes.bool.isRequired,
    handleCancel  : PropTypes.func.isRequired,
    handleConfirm : PropTypes.func.isRequired,
    text          : PropTypes.string.isRequired,
    title         : PropTypes.string
};

export default function Modal ({ title, open, handleCancel, handleConfirm, text }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleCancel}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">
                {title ?? 'Are you sure you want to complete this operation?'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
