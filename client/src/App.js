import path                from 'path';
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

function dummyLayout (props) {
    return props.children;
}

const routes = [
    {
        name      : 'Home',
        path      : '/',
        icon      : CompetitionIcon,
        component : Home
    },
    {
        name      : 'Graphics',
        path      : '/graphics',
        icon      : GraphicsIcon,
        component : Graphics
    }
    // {
    //     name     : 'Competitions',
    //     path     : '/competitions',
    //     iconPath : '../public/tournament.png'
    // }
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
                    <Redirect to='/' />
                </Switch>
            </div>
        </Suspense>
    );
}

export default App;
