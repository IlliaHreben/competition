/* eslint-disable multiline-ternary */
/* eslint-disable jsx-a11y/alt-text */
import { Stack, Typography, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import sorryImg from 'assets/icons/sorry.png';
import PropTypes from 'prop-types';

function mapState(state) {
  return {
    active: state.competitions.active
  };
}

export default function SelectCompetitionChecker({ children }) {
  const { active } = useSelector(mapState);

  if (active) {
    return children;
  }

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Container sx={{ mt: 4, justifyContent: 'center', display: 'flex' }}>
        <img src={sorryImg} width='400' />
      </Container>
      <Typography variant='h5'>At first, you need to choose competition.</Typography>
      <Typography variant='h5'>
        Please, visit &#34;Competitions&#34; page to select your competition.
      </Typography>
    </Stack>
  );
}

SelectCompetitionChecker.propTypes = {
  children: PropTypes.any
};
