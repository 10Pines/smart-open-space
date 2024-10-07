import { useContext } from 'react';
import { ResponsiveContext } from 'grommet';

const useSize = () => useContext(ResponsiveContext);

export default useSize;
