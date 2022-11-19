import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';

function mapStateToProps(state) {
  return {
    active: state.competitions.active
  };
}

export default function DenseAppBar() {
  const { active } = useSelector(mapStateToProps);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' elevation={0} sx={{ height: 'var(--app-bar-height)' }}>
        <Toolbar variant='dense'>
          <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {active && (
            <Typography
              align='center'
              variant='h6'
              color='inherit'
              component='div'
              sx={{ flexGrow: 1 }}
            >
              {active.name}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
