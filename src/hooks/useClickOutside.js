import { useEffect, useRef } from 'react'

export const useClickOutside = (callback) => {
  const elRef = useRef();
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        elRef.current &&
        callbackRef.current &&
        !elRef.current.contains(e.target)
      ) {
        callbackRef.current?.(e);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  })

  return elRef;
}
