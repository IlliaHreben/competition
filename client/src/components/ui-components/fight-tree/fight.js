import ButtonGroup from '@mui/material/ButtonGroup';
import Icon from '@mui/material/Icon';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { ReactComponent as GoldIcon } from '../../../assets/icons/gold.svg';
import { ReactComponent as SilverIcon } from '../../../assets/icons/silver.svg';
import { ReactComponent as BronzeIcon } from '../../../assets/icons/bronze.svg';
import Fighter from './fighter';
import styles from './index.module.css';

// {
//   match,
//   onMatchClick,
//   onPartyClick,
//   onMouseEnter,
//   onMouseLeave,
//   topParty,
//   bottomParty,
//   topWon,
//   bottomWon,
//   topHovered,
//   bottomHovered,
//   topText,
//   bottomText,
//   connectorColor,
//   computedStyles,
//   teamNameFallback,
//   resultFallback
// }

function Fight({
  topParty,
  bottomParty,
  handleClickParty,
  onSwitchCards,
  category,
  onMouseEnter,
  onMouseLeave,
  match
}) {
  let redMedalIcon = <div />;
  let blueMedalIcon = <div />;

  if (match.degree === 1) {
    if (topParty.isWinner) {
      redMedalIcon = <GoldIcon />;
      blueMedalIcon = <SilverIcon />;
    }
    if (bottomParty.isWinner) {
      blueMedalIcon = <GoldIcon />;
      redMedalIcon = <SilverIcon />;
    }
  } else if (match.degree === 2) {
    if (topParty.isWinner) {
      blueMedalIcon = <BronzeIcon />;
    }
    if (bottomParty.isWinner) {
      redMedalIcon = <BronzeIcon />;
    }
  }
  // else {
  //   if (topParty.isWinner) {
  //     blueMedalIcon = (
  //       <Typography variant='caption' sx={{ pt: 1 }}>
  //         L
  //       </Typography>
  //     );
  //     redMedalIcon = 'W';
  //   }
  //   if (bottomParty.isWinner) {
  //     redMedalIcon = (
  //       <Typography variant='caption' sx={{ pt: 1 }}>
  //         L
  //       </Typography>
  //     );
  //     blueMedalIcon = 'W';
  //   }
  // }

  const renderFighter = useCallback(
    ({ position, party, icon }) => {
      const color = position === 'firstCardId' ? 'red' : 'blue';
      return (
        <Fighter
          party={party}
          position={position}
          match={match}
          endIcon={party && <SportsMmaIcon sx={{ color }} />}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pr: 1,
            pl: 1,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }}
          startIcon={<Icon sx={{ m: 0 }}>{icon}</Icon>}
          className={styles.svgButton}
          key={color}
          onClick={(e) => handleClickParty?.(e, party.id, match.id)}
          onMouseEnter={() => onMouseEnter(party?.id)}
          onMouseLeave={onMouseLeave}
          category={category}
        >
          {party?.name || ''}
        </Fighter>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topParty, bottomParty, match]
  );

  return (
    <Stack direction='row'>
      <Box
        sx={{
          border: '2px solid',
          borderRight: 0,
          width: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px'
        }}
      >
        <Typography variant='h5'>{match.serialNumber}</Typography>
      </Box>
      <ButtonGroup orientation='vertical' className={styles.svgButtonGroup}>
        {[
          { position: 'firstCardId', party: topParty, icon: redMedalIcon },
          { position: 'secondCardId', party: bottomParty, icon: blueMedalIcon }
        ].map(renderFighter)}
      </ButtonGroup>
    </Stack>
  );
}

Fight.propTypes = {
  topParty: PropTypes.object,
  bottomParty: PropTypes.object,
  handleClickParty: PropTypes.func,
  onSwitchCards: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onReset: PropTypes.func,
  match: PropTypes.object,
  category: PropTypes.object
};

export default Fight;
