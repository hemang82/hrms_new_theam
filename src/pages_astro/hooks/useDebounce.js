import { useState, useEffect } from "react";

const useDebounce = (val, delay) => {
  // usefull if we are filtering data directly from the database using api
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [val]);

  return debounceVal;

};

export default useDebounce;
