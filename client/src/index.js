
import ReactDOM             from 'react-dom';
import { BrowserRouter }    from 'react-router-dom';
import { configureStore }   from '@reduxjs/toolkit';
import { Provider }         from 'react-redux';
import { SnackbarProvider } from 'notistack';
import reducers             from './reducers';

import App                  from './App';

export const store = configureStore({
    reducer    : { ...reducers },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck    : false,
        serializableCheck : false,
        thunk             : true
    }),
    devTools: process.env.NODE_ENV !== 'production'
});

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
                vertical   : 'bottom',
                horizontal : 'right'
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SnackbarProvider>
    </Provider>,
    document.getElementById('root')
);
