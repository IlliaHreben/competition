import { store }     from '../index';
import { showError } from '../actions/errors';

export default function errorsHandler ({ error }, statusCode, url) {
    // const { errors } = error;
    const errorsData = { isServer: true };

    // if (errors && errors.length) {
    //     for (const item of errors) {
    //         const field = item.uri.replace('#/', '');

    //         if (field) {
    //             errorsData[field] = item.message;
    //         }
    //     }
    // } else {
    //     errorsData.serverError = error.message;
    //     errorsData.type = error.code;
    // }
    statusHandler(error, statusCode, url);

    return errorsData;
}

function statusHandler (error, statusCode, url) {
    switch (statusCode) {
    case 200:
        console.log('='.repeat(50)); // !nocommit
        console.log(error);
        console.log('='.repeat(50));
        if (error.code === 'FORMAT_ERROR') error.message = 'Format error.';
        store.dispatch(showError({
            ...error,
            message : getErrorMessage(error.message || 'server_error'),
            proto   : 'rest',
            request : url
        }));
        break;
    case 404:
    case 500:
    case 502:
        store.dispatch(showError({
            message : getErrorMessage(error.message || 'server_error'),
            proto   : 'rest',
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
            proto   : 'rest',
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
