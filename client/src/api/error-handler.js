import { store } from '../index';
import { showError } from '../actions/errors';

export default function errorsHandler ({ error }, statusCode, url) {
    const { fields } = error || {};
    const errorsData = { isServer: true };

    if (fields) {
        for (const key in fields) {
            const field = key.replace('data/', '');

            if (field) {
                errorsData[field] = getMessageByType(fields[key], fields) || fields[key];
            }
        }
    } else {
        errorsData.serverError = error?.message;
        errorsData.type = error?.code;
    }

    statusHandler(error, statusCode, url);
    return errorsData;
}

function statusHandler (error = {}, statusCode, url) {
    switch (statusCode) {
    case 200:
        console.log('Api error:', error);
        error.message = getMessageByType(error.fields?.main, error?.fields) ||
            getMessageByType(error.code, error?.fields) ||
            error.fields?.main ||
            error.code;
        store.dispatch(showError({
            ...error,
            message : error.message,
            request : url
        }));
        break;
    case 404:
        store.dispatch(showError({
            message : `404: Route not found - ${url}`,
            request : url
        }));
        break;
    case 500:
    case 502:
        store.dispatch(showError({
            message : `${error.message} - ${url}`,
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

function getMessageByType (type, fields) {
    const messageByType = {
        DATE_TOO_HIGH                : 'Date is too high.',
        DATE_TOO_LOW                 : 'Date is too low.',
        FORMAT_ERROR                 : 'Format error.',
        VALIDATION_ERROR             : 'Validation error.',
        REQUIRED                     : 'This field is required.',
        GROUP_DOES_NOT_EXIST         : 'For full sections group must be specified.',
        DOESNT_FIT_INTO_ANY_CATEGORY : 'A suitable category was not found for this card parameters.'
        // RELATED_INSTANCES            : 'This instance has related entities.'
    };

    const functionMessageByType = {
        RELATED_INSTANCES: (fields) => {
            const _fields = { ...fields };
            delete fields.main;
            const entries = Object.entries(_fields);
            const messages = entries
                .map(([ instanceName, instance ]) => {
                    if (instanceName.includes('cards/')) {
                        const cardsLength = entries.filter(([ key ]) => key.includes('cards/')).length;
                        const andMore = cardsLength > 1 ? `and ${cardsLength - 1} more are` : 'is';
                        return `${instance} ${andMore} related to this category. Delete them before.`;
                    }
                    return 'Some entities are related to this category. Delete them before.';
                });

            return messages[0];
        }
    };

    return messageByType[type] || functionMessageByType[type]?.(fields);
}
