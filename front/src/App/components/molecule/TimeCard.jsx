import DateTimeIndicator from '../atom/DateTimeIndicator';
import Card from '../molecule/Card';
import { Box, Text } from 'grommet';

const TimeCard = ({ date, ...props }) => {
  return (
    <Box direction="row" height="fit-content">
      <Box
        round={{
          size: 'small',
          corner: 'left',
        }}
        style={{
          backgroundColor: '#3F8880',
        }}
      >
        <DateTimeIndicator
          style={{ transform: 'scale(0.7)' }}
          date={{
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
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

export default TimeCard;
