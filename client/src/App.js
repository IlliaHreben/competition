// import path                from 'path';
import React, { Suspense } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

import PageLoader          from './components/ui-components/PageLoader/index.js';
import SideBar             from './components/ui-components/sidebar/sidebar.js';

import styles              from './App.module.css';

import CompetitionIcon     from './assets/icons/tournament.png';
import GraphicsIcon        from './assets/icons/graphics.png';

const Graphics = React.lazy(() => import('./components/pages/graphics'));
const Home = React.lazy(() => import('./components/pages/home')); ;
const CompetitionCreate = React.lazy(() => import('./components/pages/competitions/create.js'));
const CompetitionList = React.lazy(() => import('./components/pages/competitions/list.js'));

function dummyLayout (props) {
    return props.children;
}

const routes = [
    {
        name      : 'Home',
        path      : '/',
        icon      : '',
        component : Home
    },
    {
        name      : 'Competitions',
        path      : '/competitions',
        icon      : CompetitionIcon,
        component : CompetitionList
    },
    {
        name      : 'Graphics',
        path      : '/graphics',
        icon      : GraphicsIcon,
        component : Graphics
    }
];

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
            <SideBar tabs={routes} />
            <div className={styles.content}>
                <Switch>
                    {routes.map(route => (
                        <AppRoute
                            key={route.name}
                            path={route.path}
                            component={route.component}
                            exact
                        />
                    ))}
                    <AppRoute
                        path={'/competitions/create'}
                        component={CompetitionCreate}
                        exact
                    />
                    <Redirect to='/' />
                </Switch>
            </div>
        </Suspense>
    );
}

export default App;
