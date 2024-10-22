import { useState } from 'react';
import useIsMounted from '#helpers/useIsMounted';

const useLoading = () => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);

  const fn = (cb) => async (value) => {
    setLoading(true);
    try {
      const res = await cb(value);
      if (isMounted.current) setLoading(false);
      return res;
    } catch (e) {
      if (isMounted.current) setLoading(false);
      throw e;
    }
  };

  return [loading, fn];
};

export default useLoading;
