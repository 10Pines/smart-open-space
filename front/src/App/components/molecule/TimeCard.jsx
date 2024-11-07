import DateTimeIndicator from '../atom/DateTimeIndicator';
import Card from '../molecule/Card';
import { Box } from 'grommet';
import PropTypes from 'prop-types';

const TimeCard = ({ time, ...props }) => {
  return (
    <Box direction="row" height="fit-content">
      <Box
        round={{
          size: 'small',
          corner: 'left',
        }}
        style={{
          backgroundColor: '#3F8880',
          boxShadow: '-4px 0px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <DateTimeIndicator
          style={{ transform: 'scale(0.7)' }}
          date={{
            start: time.start,
            end: time.end,
          }}
        />
      </Box>
      <Card
        {...props}
        round={{
          size: 'small',
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
