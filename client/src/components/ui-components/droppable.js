import { useDrop } from 'react-dnd';
import { useEffect } from 'react';
import { PropTypes } from 'prop-types';

export default function Droppable({ children, onDrop, onOver, onOverLeft, item }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'drag',
      drop(_item, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop && _item !== item) {
          return;
        }
        onDrop(_item);
      },
      collect: (monitor) => ({
        // isOver: monitor.isOver(),
        isOver: monitor.isOver({ shallow: true })
      })
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

  return <div ref={drop}>{children}</div>;
}
Droppable.propTypes = {
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
  onOver: PropTypes.func,
  onOverLeft: PropTypes.func,
  item: PropTypes.any
};
