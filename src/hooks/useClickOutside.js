import { useEffect, useRef } from 'react'

export const useClickOutside = (callback) => {
  const elRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    console.log("useEffect")
    const handleClickOutside = e => {
      console.log(e)
      console.log(elRef.current)
      console.log(!elRef.current)

      console.log(e.target)
      if (elRef.current && !elRef.current.contains(e.target)) {
        callbackRef.current && callbackRef.current(e);
      }
    
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

    }
  }, [ elRef,callback])

  return elRef;
}
