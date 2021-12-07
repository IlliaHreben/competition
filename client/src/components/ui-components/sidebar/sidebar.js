import PropTypes from 'prop-types';
import {
    Typography, Stack,
    IconButton, Avatar
} from '@mui/material';

import styles from './sidebar.module.css';

import { useNavigate } from 'react-router';

function SideBar ({ tabs }) {
    const navigate = useNavigate();

    return (
        <div className={styles.sideBar}>
            <Stack >
                {tabs.map(tab => (
                    <IconButton sx={{ borderRadius: 0, pt: 1.5, pb: 1 }}key={tab.name} aria-label={tab.name} size="small" onClick={() => navigate(tab.path)}>
                        <Stack sx={{ alignItems: 'center' }} >
                            <Avatar src={tab.icon} variant="square" sx={{ width: 36, height: 36, pb: 0.5 }} />
                            <Typography sx={{ fontSize: '11px' }}>{tab.name}</Typography>
                        </Stack>
                    </IconButton>
                ))}
            </Stack>
        </div>
    );
}

SideBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        name : PropTypes.string.isRequired,
        path : PropTypes.string.isRequired,
        icon : PropTypes.string
    })).isRequired
};

export default SideBar;
