import DateTimeIndicator from '../atom/DateTimeIndicator';
import Card from '../molecule/Card';
import { Box } from 'grommet';
import PropTypes from 'prop-types';
import {useState} from "react";
import {usePushToOpenSpace} from "#helpers/routes.jsx";
import {useUser} from "#helpers/useAuth.jsx";

const TimeCard = ({ time, dates, id, author, ...props }) => {
    const [hover, setHover] = useState(false);
    const PushToOpenSpace = usePushToOpenSpace(id);
    const user = useUser();
    const isOrganizer = author.id === user.id;
  return (
    <Box direction="row" width={"580px"} height={"300px"} onClick={() => {PushToOpenSpace()}}
         borderColor={hover ? 'accent-1' : 'brand'}
         elevation={hover ? 'xlarge' : 'small'}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
         round={{size: '5px'}}
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
        isOrganizer={isOrganizer}
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
