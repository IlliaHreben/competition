import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from 'actions/errors';

let displayedErrors = [];

export default function useErrors() {
  const dispatch = useDispatch();
  const errors = useSelector((store) => store.errors.list);
  const { enqueueSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayedErrors = [...displayedErrors, id];
  };

  const removeDisplayed = (id) => {
    displayedErrors = [...displayedErrors.filter((key) => id !== key)];
  };

  useEffect(() => {
    errors.forEach(({ id, message, type }) => {
      if (displayedErrors.includes(id)) return;

      enqueueSnackbar(message, {
        key: id,
        variant: type,
        // onClose: (event, reason, id) => {
        //     if (options.onClose) {
        //         options.onClose(event, reason, id);
        //     }
        // },
        onExited: (event, id) => {
          dispatch(removeMessage(id));
          removeDisplayed(id);
        }
      });

      storeDisplayed(id);
    });
  }, [dispatch, enqueueSnackbar, errors]);
}
