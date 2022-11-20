import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import styles from './fight-formulas.module.css';

const EnhancedTableToolbar = (props) => {
  const { handleClickCreate } = props;

  return (
    <Toolbar
      className={styles.toolbar}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Button
          sx={{ marginRight: '20px' }}
          variant='contained'
          size='large'
          onClick={handleClickCreate}
        >
          create
        </Button>
      </Box>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClickCreate: PropTypes.func.isRequired
};

export default EnhancedTableToolbar;
