import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

Modal.propTypes = {
    open              : PropTypes.bool.isRequired,
    handleClose       : PropTypes.func.isRequired,
    handleConfirm     : PropTypes.func.isRequired,
    children          : PropTypes.any.isRequired,
    title             : PropTypes.string,
    confirmButtonText : PropTypes.string,
    disabled          : PropTypes.bool
};

Modal.defaultProps = {
    disabled: false
};

const Transition = forwardRef(function Transition (props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Modal ({
    title, open, handleClose, handleConfirm,
    children, disabled, confirmButtonText, ...props
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const _children = typeof children === 'string' ? [ children ] : children;

    return (
        <Dialog
            {...props}
            {...!fullScreen && { sx: { ml: 'var(--navbar-width)' } }}
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">
                {title ?? 'Are you sure you want to complete this operation?'}
            </DialogTitle>
            <DialogContent sx={{ pr: 2, pl: 2 }}>
                {(Array.isArray(_children) && _children.every(c => typeof c === 'string'))
                    ? _children.map((c, i) => <DialogContentText key={i}>{c}</DialogContentText>)
                    : children
                }
            </DialogContent>
            <DialogActions sx={{ mr: 1, ml: 1, mb: 1 }}>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={disabled}
                    variant="contained"
                    autoFocus
                >
                    {confirmButtonText || 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
