// import { showError }                         from '../actions/errors';

export default function errorsHandler (error, statusCode, url) {
    console.log('='.repeat(50));
    console.log(error);
    console.log('='.repeat(50));
    return error;
    // const { errors } = error;
    // const errorsData = { isServer: true };

    // if (errors && errors.length && error.type === 'validation') {
    //     for (const item of errors) {
    //         const field = item.uri.replace('#/', '');

    //         if (field) {
    //             errorsData[field] = item.message;
    //         }
    //     }
    // } else {
    //     errorsData.serverError = error.message;
    //     errorsData.type = error.type;
    // }
    // statusHandler(error, statusCode, url);

    // return errorsData;
}

// function statusHandler (error, statusCode, url) {
//     switch (statusCode) {
//     case 404:
//     case 500:
//     case 502:
//         store.dispatch(showError({
//             message : error.message ? error.message : 'server_error',
//             proto   : 'rest',
//             request : url
//         }));
//         break;
//     case 403: {
//         if (url === 'user/profile' || url === 'user/login') return;

//         store.dispatch({ type: LOGOUT });
//         resetLocalStorageState();
//         store.dispatch(getCsrf());

//         store.dispatch(showError({
//             message : error.message,
//             proto   : 'rest',
//             request : url
//         }, true));

//         history.push('/login');

//         break;
//     }
//     case 422:
//     case 499:
//         return;
//     default:
//         store.dispatch(showError({
//             message : 'unknown_error',
//             proto   : 'rest',
//             request : url
//         }));
//     }
// }
