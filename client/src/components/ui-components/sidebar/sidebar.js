import PropTypes from 'prop-types';
import { Typography, Stack, IconButton, Avatar, Badge } from '@mui/material';

import styles from './sidebar.module.css';

import { useNavigate, useLocation } from 'react-router';

import AddIcon from '../../../assets/icons/plus.png';

// eslint-disable-next-line react/prop-types
const AvatarIcon = ({ src }) => {
  return <Avatar src={src} variant="square" sx={{ width: 36, height: 36, pb: 0.5 }} />;
};

function SideBar({ tabs }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.sideBar}>
      <Stack sx={{ width: '100%' }}>
        {tabs.map((tab) => (
          <IconButton
            disableRipple
            sx={{
              borderRadius: 0,
              p: 0,
              pt: 1.5,
              pb: 1,
              backgroundColor: location.pathname === tab.path ? 'rgba(0,0,0,0.04)' : 'none'
            }}
            key={tab.name}
            aria-label={tab.name}
            size="small"
            onClick={() => navigate(tab.path)}
          >
            <Stack sx={{ alignItems: 'center' }}>
              {tab.create ? (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar
                      sx={{
                        width: '16px',
                        height: '16px',
                        border:
                          location.pathname === tab.path
                            ? '2px solid rgb(232,232,232)'
                            : '2px solid rgb(242,242,242)'
                      }}
                      alt={tab.name}
                      src={AddIcon}
                    />
                  }
                >
                  <AvatarIcon src={tab.icon} />
                </Badge>
              ) : (
                <AvatarIcon src={tab.icon} />
              )}
              <Typography sx={{ fontSize: '11px' }}>{tab.name}</Typography>
            </Stack>
          </IconButton>
        ))}
      </Stack>
    </div>
  );
}

SideBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      create: PropTypes.bool,
      icon: PropTypes.string
    })
  ).isRequired
};

export default SideBar;
