import PropTypes   from 'prop-types';
import Divider     from '@mui/material/Divider';
import Stack       from '@mui/material/Stack';
import IconButton  from '@mui/material/IconButton';
import Avatar      from '@mui/material/Avatar';

import styles      from './sidebar.module.css';

import {
    Link
} from 'react-router-dom';
// import {
//     useRouteMatch
// } from 'react-router';

function SideBar ({ tabs }) {
    // const match = useRouteMatch();
    // const path = match.path;

    return (
        <div className={styles.sideBar}>
            <Stack
                divider={<Divider flexItem />}
                spacing={2}
            >
                {tabs.map(tab => (
                    <Link key={tab.name} to={tab.path}>
                        <IconButton aria-label={tab.name} size="medium">
                            <Avatar src={tab.icon} variant="rounded" />
                        </IconButton>
                    </Link>
                ))}
            </Stack>
        </div>
    );
}

SideBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        name : PropTypes.string.isRequired,
        path : PropTypes.string.isRequired,
        icon : PropTypes.string.isRequired
    })).isRequired
};

export default SideBar;
