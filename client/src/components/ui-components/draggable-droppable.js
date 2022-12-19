import { useDrop, useDrag } from 'react-dnd';
import { useEffect, useRef, useMemo, Children, isValidElement, cloneElement } from 'react';
import { PropTypes } from 'prop-types';

export default function DraggableDroppable({
  disableWrapper,
  children,
  onDrop,
  onOver,
  onOverLeft,
  item,
  type = 'drag',
  validateDrop = () => true
}) {
  const ref = useRef(null);
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: type,
      canDrop: (_item) => validateDrop(_item),
      drop(_item, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop || _item === item) {
          return;
        }
        console.log(_item, '->', item);
        monitor.canDrop() && onDrop(_item);
      },
      collect: (monitor) => {
        const isOver = monitor.isOver({ shallow: true });
        return {
          // isOver: monitor.isOver(),
          canDrop: isOver && monitor.canDrop(),
          isOver
        };
      }
    }),
    [item, onDrop, validateDrop]
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item,
      //   canDrag: !forbidDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [
      /* forbidDrag, color */
      item
    ]
  );
  // console.log(canDrop);

  const opacity = useMemo(() => (isDragging ? 0.4 : 1), [isDragging]);

  useEffect(() => {
    if (isOver) {
      onOver?.();
    } else {
      onOverLeft?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  drag(drop(ref));

  if (disableWrapper) {
    const childrenWithProps = Children.map(children, (child) => {
      // Checking isValidElement is the safe way and avoids a typescript error too.
      if (isValidElement(child)) {
        return cloneElement(child, {
          ref,
          style: {
            ...children.props.style,
            opacity,
            ...(canDrop && { backgroundColor: '#c5fecf' }),
            ...(isOver && !canDrop && { backgroundColor: '#fec5c5' })
          }
        });
      }
      return child;
    });
    return childrenWithProps;
  }

  return (
    <div ref={ref} style={{ opacity }}>
      {children}
    </div>
  );
}
DraggableDroppable.propTypes = {
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
  onOver: PropTypes.func,
  onOverLeft: PropTypes.func,
  item: PropTypes.any,
  disableWrapper: PropTypes.bool,
  type: PropTypes.string,
  validateDrop: PropTypes.func
};
