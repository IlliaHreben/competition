import { SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets';
import useWindowSize from '../../../hooks/use-window-size';
import Fight from './fight';
import { PropTypes } from 'prop-types';

export const CustomMatchBracket = ({ handleClickParty, ...props }) => {
    const { width, height } = useWindowSize();
    const finalWidth = Math.max(width - 100, 500);
    const finalHeight = Math.max(props.matches.length * 150, 800);

    return width && height && (
        <SingleEliminationBracket
            {...props}
            options={{
                style: {
                    roundHeader             : { backgroundColor: '#AAA' },
                    connectorColor          : '#FF8C00',
                    connectorColorHighlight : '#000',
                },
            }}
            svgWrapper={({ children, ...props }) => (
                <SVGViewer
                    // background={WhiteTheme.svgBackground}
                    // SVGBackground={WhiteTheme.svgBackground}
                    {...props}

                    width={finalWidth}
                    height={finalHeight}
                >
                    {children}
                </SVGViewer>
            )}
            matchComponent={({
                match,
                onMatchClick,
                onPartyClick,
                onMouseEnter,
                onMouseLeave,
                topParty,
                bottomParty,
                topWon,
                bottomWon,
                topHovered,
                bottomHovered,
                topText,
                bottomText,
                connectorColor,
                computedStyles,
                teamNameFallback,
                resultFallback,
            }) => {
                // console.log('='.repeat(50)); // !nocommit
                // console.log({
                //     match,
                //     onMatchClick,
                //     onPartyClick,
                //     onMouseEnter,
                //     onMouseLeave,
                //     topParty,
                //     bottomParty,
                //     topWon,
                //     bottomWon,
                //     topHovered,
                //     bottomHovered,
                //     topText,
                //     bottomText,
                //     connectorColor,
                //     computedStyles,
                //     teamNameFallback,
                //     resultFallback, });
                // console.log('='.repeat(50));
                return (
                    <div
                        id={match.id}
                        style={{
                            display        : 'flex',
                            flexDirection  : 'column',
                            justifyContent : 'space-around',
                            color          : '#000',
                            width          : '100%',
                            height         : '100%',
                        }}
                    >
                        <Fight
                            id={match.id}
                            match={match}
                            topParty={topParty}
                            bottomParty={bottomParty}
                            handleClickParty={handleClickParty}
                        />
                        {/* <div
                    onMouseEnter={() => onMouseEnter(topParty.id)}
                    style={{ display: 'flex' }}
                >
                    <div>{topParty.name || teamNameFallback}</div>
                    <div>{topParty.resultText ?? resultFallback(topParty)}</div>
                </div>
                <div
                    style={{ height: '1px', width: '100%', background: '#FF8C00' }}
                />
                <div
                    onMouseEnter={() => onMouseEnter(bottomParty.id)}
                    style={{ display: 'flex' }}
                >
                    <div>{bottomParty.name || teamNameFallback}</div>
                    <div>{bottomParty.resultText ?? resultFallback(topParty)}</div>
                </div> */}
                    </div>
                );
            }}
        />
    );
};

CustomMatchBracket.propTypes = {
    handleClickParty : PropTypes.func,
    matches          : PropTypes.array,
};