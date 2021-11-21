// import path                from 'path';
import {
    Suspense, lazy
} from 'react';

import {
    Route,
    Routes
} from 'react-router-dom';

import PageLoader          from './components/ui-components/PageLoader';
import SideBar             from './components/ui-components/sidebar/sidebar.js';
import AppBar             from './components/ui-components/app-bar.js';
import useErrors           from './components/ui-components/notifiers/useErrors.js';

import styles              from './App.module.css';

import CompetitionIcon     from './assets/icons/tournament.png';
import GraphicsIcon        from './assets/icons/graphics.png';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const Graphics = lazy(() => import('./components/pages/graphics'));
const Home = lazy(() => import('./components/pages/home')); ;
const CompetitionCreate = lazy(() => import('./components/pages/competitions/create.js'));
const CompetitionList = lazy(() => import('./components/pages/competitions/list.js'));
const CompetitionUpdate = lazy(() => import('./components/pages/competitions/update'));

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

function App () {
    useErrors();

    return (
        <Suspense fallback={<PageLoader />}>
            <AppBar />
            <div style={{ display: 'flex' }}>
                <SideBar tabs={routes} />
                <div className={styles.content}>
                    <Routes>
                        {routes.map(({ component: Page, ...route }) => (
                            <Route
                                key={route.name}
                                path={route.path}
                                element={<Page/>}
                            />
                        ))}
                        <Route
                            path={'/competitions/create'}
                            element={<CompetitionCreate/>}
                        />
                        <Route
                            path={'/competitions/:id/edit'}
                            element={<CompetitionUpdate/>}
                        />
                    </Routes>
                </div>
            </div>
        </Suspense>
    );
}

export default App;
