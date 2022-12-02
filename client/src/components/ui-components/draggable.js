import { useDrag } from 'react-dnd';
import { useMemo } from 'react';
import { PropTypes } from 'prop-types';

export default function Draggable({ children, item }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'drag',
      item,
      //   canDrag: !forbidDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [
      /* forbidDrag, color */
    ]
  );

  const opacity = useMemo(() => (isDragging ? 0.4 : 1), [isDragging]);

  return (
    <div ref={drag} style={{ opacity }}>
      {children}
    </div>
  );
}
Draggable.propTypes = {
  children: PropTypes.node.isRequired,
  item: PropTypes.any
};
