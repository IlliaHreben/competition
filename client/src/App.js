import React, { Suspense } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

import PageLoader          from './components/ui-components/PageLoader';

const Graphics = React.lazy(() => import('./components/pages/graphics'));
const Home = React.lazy(() => import('./components/pages/home'));

function dummyLayout (props) {
    return props.children;
}

function AppRoute ({ component: Page, isLoginRequire, layout, ...rest }) { // eslint-disable-line react/prop-types
    return (
        <Route
            {...rest}
            render={props => {
                const Layout = layout || dummyLayout;

                return (
                    <Layout>
                        <Page {...props} />
                    </Layout>
                );
            }}
        />
    );
}

function App () {
    return (
        <Suspense fallback={<PageLoader />}>
            <Switch>
                <AppRoute
                    path='/'
                    exact
                    component={Home}
                />
                <AppRoute
                    path='/graphics'
                    exact
                    component={Graphics}
                />
                <Redirect to='/' />
            </Switch>
        </Suspense>
    );
}

export default App;
