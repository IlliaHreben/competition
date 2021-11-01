
import ReactDOM                         from 'react-dom';
import { BrowserRouter }                from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider }                     from 'react-redux';
import thunkMiddleware                  from 'redux-thunk';
import { SnackbarProvider }             from 'notistack';
import reducers                         from './reducers';

import App                              from './App';

export const store = createStore(
    reducers,
    applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SnackbarProvider>
    </Provider>,
    document.getElementById('root')
);
