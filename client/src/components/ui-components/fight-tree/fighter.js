import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDrag, useDrop } from 'react-dnd';
import { useRef, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import throttle from 'lodash.throttle';

const ColorButton = styled(Button)(({ theme }) => ({
    color           : theme.palette.getContrastText('#ffffff'),
    backgroundColor : '#ffffff',
    '&:hover'       : {
        backgroundColor : 'rgb(245, 245, 245)',
        border          : '2px solid !important'
    },
    border                  : '2px solid !important',
    '&:not(:first-of-type)' : {
        marginTop: '-2px !important'
    }


}));

const itemTypes = {
    FIGHTER: 'fighter'
};

function Fighter({ fighter, match, switchCards, resetCategory, children,...props }) {
    const ref = useRef(null);
    const [ { isDragging, ref: dragingRef }, drag ] = useDrag(() => ({
        type : itemTypes.FIGHTER,
        item : () => {
            return { card: fighter, match, children };
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [ innerChildren, setChildren ] = useState(children);
    // console.log(ref);

    const [ hovered, setHovered ] = useState(false);
    
    // const switchCardsThrottled = useMemo(() => {
    //     return throttle(switchCards, 200);
    // }, [ switchCards ]);

    const [ { isOver, handlerId }, drop ] = useDrop(() => ({
        accept  : itemTypes.FIGHTER,
        // drop    : () => moveKnight(x, y),
        collect : monitor => ({
            handlerId : monitor.getHandlerId(),
            isOver    : !!monitor.isOver(),
            
        }),
        hover(item, monitor) {
            if (!ref.current || item.card.id === fighter.id) {
                return;
            }
            
            // console.log('_'.repeat(50)); // !nocommit
            // console.log(isOver,hovered );
            // console.log('_'.repeat(50));
            if (!monitor.isOver()) {
                setHovered(true);
                setChildren(item.children);
                switchCards({ card: fighter, match }, item);
                
            };
            
        }
    }));
    // console.log('='.repeat(50)); // !nocommit
    // console.log(handlerId, isOver);
    // console.log('='.repeat(50));

    useMemo(() => {
        if (isOver || !hovered) return; 
        console.log('='.repeat(50)); // !nocommit
        console.log(isOver,hovered );
        console.log('='.repeat(50));
        setHovered(false);
        resetCategory();
    }, [ isOver, hovered, resetCategory ]);
    if (isOver) console.log(isOver);

    drag(drop(ref));
    return (
        <ColorButton ref={ref} data-handler-id={handlerId}
            style={{
                opacity: isDragging ? 0.5 : 1,
            }} {...props}
        >{innerChildren}
        </ColorButton>

    );
}

Fighter.propTypes = {
    fighter       : PropTypes.object,
    match         : PropTypes.object,
    switchCards   : PropTypes.func,
    resetCategory : PropTypes.func,
    children      : PropTypes.any
};



export default Fighter;
