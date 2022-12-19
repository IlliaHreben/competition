import { useDrop } from 'react-dnd';
import { useEffect, Children, isValidElement, cloneElement } from 'react';
import { PropTypes } from 'prop-types';

export default function Droppable({
  children,
  onDrop,
  onOver,
  onOverLeft,
  item,
  validateDrop = () => true
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'drag',
      canDrop: (_item) => validateDrop(_item),
      drop(_item, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop && _item === item) {
          return;
        }
        onDrop(_item);
      },
      collect: (monitor) => {
        const isOver = monitor.isOver({ shallow: true });
        return {
          canDrop: isOver && monitor.canDrop(),
          isOver
        };
      }
    }),
    []
  );

  useEffect(() => {
    if (isOver) {
      onOver?.();
    } else {
      onOverLeft?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  const childrenWithProps = Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript error too.
    if (isValidElement(child)) {
      return cloneElement(child, {
        ref: drop,
        style: {
          ...children.props.style,
          ...(canDrop && { backgroundColor: 'rgba(197,254,207,0.3)' }),
          ...(isOver && !canDrop && { backgroundColor: '#fec5c5' })
        }
      });
    }
    return child;
  });
  return childrenWithProps;
  // return <Fragment ref={drop}>{children}</Fragment>;
}
Droppable.propTypes = {
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
  onOver: PropTypes.func,
  onOverLeft: PropTypes.func,
  item: PropTypes.any
};
