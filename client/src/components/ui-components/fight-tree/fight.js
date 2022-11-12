import ButtonGroup from '@mui/material/ButtonGroup';
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
import Icon from '@mui/material/Icon';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import { ReactComponent as GoldIcon } from '../../../assets/icons/gold.svg';
import { ReactComponent as SilverIcon } from '../../../assets/icons/silver.svg';
// import { ReactComponent as BronzeIcon } from '../../../assets/icons/bronze.svg';
import Fighter from './fighter';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

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
  onReset,
  onMouseEnter,
  onMouseLeave,
  match
}) {
  let redMedalIcon = <div />;
  let blueMedalIcon = <div />;

  const isFinal = !match.nextFightId;
  // if (topParty && bottomParty) {
  if (isFinal) {
    if (topParty.isWinner) {
      redMedalIcon = <GoldIcon />;
      blueMedalIcon = <SilverIcon />;
    }
    if (bottomParty.isWinner) {
      blueMedalIcon = <GoldIcon />;
      redMedalIcon = <SilverIcon />;
    }
  }
  // if (fight.degree === 2) {
  //     if (topParty.id === fight?.winnerId) blueMedalIcon = <BronzeIcon />;
  //     if (bottomParty.id === fight?.winnerId) redMedalIcon = <BronzeIcon />;
  // }
  // }

  const renderFighter = useCallback(
    ({ children, ...props }) => {
      return <Fighter {...props}>{children}</Fighter>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topParty, bottomParty, match]
  );

  const buttons = [
    { color: 'red', party: topParty, icon: redMedalIcon },
    { color: 'blue', party: bottomParty, icon: blueMedalIcon }
  ].map(({ color, party, icon }) =>
    renderFighter({
      fighter: party,
      match,
      endIcon: party && <SportsMmaIcon sx={{ color }} />,
      sx: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 0
      },
      startIcon: <Icon sx={{ m: 0 }}>{icon}</Icon>,
      className: styles.svgButton,
      key: color,
      onClick: (e) => handleClickParty?.(e, party.id, match.id),
      switchCards: onSwitchCards,
      resetCategory: onReset,
      children: party?.name || '',
      onMouseEnter: () => onMouseEnter(party?.id),
      onMouseLeave
    })
  );

  // const groupRef = useRef(null);
  // const [ width, setDivWidth ] = useState(0);
  // const [ height, setDivHeight ] = useState(0);

  // useEffect(() => {
  //     setDivWidth(groupRef.current?.offsetWidth || 0);
  //     setDivHeight(groupRef.current?.offsetHeight || 0);
  // }, []);

  return (
    // <div
    //     style={{ width: `${width}px`, height: `${height + 48}px`, justifyContent: !bottomParty && topParty ? 'flex-start' : 'center' }}
    //     className={styles.fightContainer}
    // >
    //     {/* {topParty &&
    //     <Stack direction="row" spacing={3}>
    //         <Chip
    //             label={topParty.coach || ''}
    //             style={{ backgroundColor: topParty.coachColor }}
    //             size="small"
    //         />
    //         <Chip
    //             label={topParty.club || ''}
    //             style={{ backgroundColor: topParty.clubColor }}
    //             size="small"
    //         />
    //     </Stack>
    //     } */}
    <ButtonGroup
      // ref={groupRef}
      orientation="vertical"
      className={styles.svgButtonGroup}
    >
      {buttons}
    </ButtonGroup>
    //     {/* {bottomParty &&
    //     <Stack direction="row" spacing={3}>
    //         <Chip
    //             label={bottomParty.coach || ''}
    //             style={{ backgroundColor: bottomParty.coachColor }}
    //             size="small"
    //         />
    //         <Chip
    //             label={bottomParty.club || ''}
    //             style={{ backgroundColor: bottomParty.clubColor }}
    //             size="small"
    //         />
    //     </Stack>
    //     } */}
    // </div>
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
  match: PropTypes.object
};

export default Fight;
