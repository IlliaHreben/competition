import { useRef, useEffect, useState } from 'react';

export function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}

export function useFocus() {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
}

export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1); // update state to force render
}
