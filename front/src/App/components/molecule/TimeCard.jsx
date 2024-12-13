import DateTimeIndicator from '../atom/DateTimeIndicator';
import Card from '../molecule/Card';
import { Box } from 'grommet';
import PropTypes from 'prop-types';
import {useState} from "react";
import {usePushToOpenSpace} from "#helpers/routes.jsx";

const TimeCard = ({ time, dates, id, ...props }) => {
    const [hover, setHover] = useState(false);
    const PushToOpenSpace = usePushToOpenSpace(id);
  return (
    <Box direction="row" width={"580px"} height={"300px"} onClick={() => {PushToOpenSpace()}}
         borderColor={hover ? 'accent-1' : 'brand'}
         elevation={hover ? 'xlarge' : 'small'}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
    >
      <Box
        round={{
          size: '5px',
          corner: 'left',
        }}
        style={{
          backgroundColor: '#3F8880',
          boxShadow: '-4px 0px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)',
            alignItems: "center"
        }}
        height={"100%"}
        width={"100px"}
      >
        <DateTimeIndicator
          date={{
            start: time.start,
            end: time.end,
          }}
          dates={dates}
          round={{
              size: '5px',
          }}
          width={"80%"}
        />
      </Box>
      <Card
        {...props}
          height={"300px"}
        width={"491px"}
        round={{
          size: '5px',
          corner: 'right',
        }}
        color="white"
      />
    </Box>
  );
};

TimeCard.propTypes = {
  time: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  props: PropTypes.object,
};

export default TimeCard;
