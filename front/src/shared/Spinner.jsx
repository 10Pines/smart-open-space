import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { Cloudlinux } from 'grommet-icons';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
`;

const Spinner = ({ center = true, ...props }) => {
  const [inDelay, setInDelay] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setInDelay(false), 400);
    return () => clearInterval(id);
  }, []);

  return inDelay ? null : (
    <div
      style={
        center ? { marginTop: '2em', fontSize: '2em', textAlign: 'center' } : undefined
      }
    >
      <Rotate>
        <Cloudlinux color="brand" size="large" {...props} />
      </Rotate>
    </div>
  );
};
Spinner.propTypes = { center: PropTypes.bool };

const TinySpinner = (props) => <Spinner center={false} size="medium" {...props} />;

export { TinySpinner };
export default Spinner;
