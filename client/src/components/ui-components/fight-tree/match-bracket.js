import { SingleEliminationBracket } from '@g-loot/react-tournament-brackets';
// import useWindowSize from '../../../hooks/use-window-size';
import Fight from './fight';
import { PropTypes } from 'prop-types';

export const CustomMatchBracket = ({ handleClickParty, category, ...props }) => {
  // const { width, height } = useWindowSize();
  // // const finalWidth = Math.max(width - 100, 1900);
  // // const finalHeight = Math.max(props.matches.length * 250, 800);

  // if (!width || !height) return null;
  return (
    <SingleEliminationBracket
      {...props}
      // svgWrapper={({ children, ...props }) => (
      //   <SVGViewer
      //     // background={WhiteTheme.svgBackground}
      //     // SVGBackground={WhiteTheme.svgBackground}
      //     {...props}
      //     width={finalWidth}
      //     height={finalHeight}
      //   >
      //     {children}
      //   </SVGViewer>
      // )}
      matchComponent={(matchProps) => {
        return (
          <div
            id={matchProps.match.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              color: '#000',
              width: '100%',
              height: '100%'
            }}
          >
            <Fight {...matchProps} handleClickParty={handleClickParty} category={category} />
          </div>
        );
      }}
    />
  );
};

CustomMatchBracket.propTypes = {
  handleClickParty: PropTypes.func,
  matches: PropTypes.array,
  category: PropTypes.object
};
