import { store }     from '../index';
import { showError } from '../actions/errors';

export default function errorsHandler ({ error }, statusCode, url) {
    const { fields } = error;
    const errorsData = { isServer: true };

    if (fields) {
        for (const key in fields) {
            const field = key.replace('data/', '');

            if (field) {
                errorsData[field] = getMessageByType(fields[key]);
            }
        }
    } else {
        errorsData.serverError = error.message;
        errorsData.type = error.code;
    }

    statusHandler(error, statusCode, url);
    return errorsData;
}

function statusHandler (error, statusCode, url) {
    switch (statusCode) {
    case 200:
        console.log('Api error:', error);
        error.message = getMessageByType(error.code);
        store.dispatch(showError({
            ...error,
            message : error.message,
            request : url
        }));
        break;
    case 404:
    case 500:
    case 502:
        store.dispatch(showError({
            message : error.message,
            request : url
        }));
        break;
    case 403: {
        return;
        // if (url === 'user/profile' || url === 'user/login') return;

        // store.dispatch({ type: LOGOUT });
        // resetLocalStorageState();
        // store.dispatch(getCsrf());

        // store.dispatch(showError({
        //     message : error.message,
        //     proto   : 'rest',
        //     request : url
        // }, true));

        // history.push('/login');

        // break;
    }
    case 422:
    case 499:
        return;
    default:
        store.dispatch(showError({
            message : getErrorMessage('unknown_error'),
            request : url
        }));
    }
}

function getErrorMessage (error) {
    switch (error) {
    case 'server_error':
        return 'Server error.';
    case 'websocket_init_error':
        return 'Failed to initialize WebSocket connection.';
    case 'request_forbidden':
        return 'Forbidden operations';
    case 'disconnect':
        return 'Connection error. Trying to establish connection.';
    case 'cookie_expired':
        return 'Your session is expired. Please log back in.';
    default:
        return error;
    }
}

function getMessageByType (type) {
    const messageByType = {
        DATE_TOO_HIGH : 'Date is too high.',
        DATE_TOO_LOW  : 'Date is too low.',
        FORMAT_ERROR  : 'Format error.'
    };

    return messageByType[type] || 'Server error.';
}
