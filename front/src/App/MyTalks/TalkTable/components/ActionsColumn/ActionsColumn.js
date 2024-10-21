import { Box } from 'grommet';
import { ScheduleButton } from './ScheduleButton';
import { RescheduleButton } from './RescheduleButton';
import { DeleteButton } from './DeleteButton';
import { InQueueButton } from './InQueueButton';
import { QueueButton } from './QueueButton';
import { EditButton } from './EditButton';
import React from 'react';

export function ActionsColumn({
  activeQueue,
  datum,
  onClickScheduleButton,
  onClickRescheduleButton,
  onClickDeleteButton,
  onClickInQueueButton,
  onClickQueueButton,
  onClickEditButton,
}) {
  return (
    <Box pad={{ vertical: 'xsmall' }} direction="row" gap="xsmall">
      {datum.state == 'Presentada' ? (
        <ScheduleButton onClick={onClickScheduleButton} />
      ) : (
        <RescheduleButton onClick={onClickRescheduleButton} />
      )}
      <DeleteButton onClick={onClickDeleteButton} />
      {datum.isInqueue ? (
        <InQueueButton onClick={onClickInQueueButton} />
      ) : (
        datum.canBeQueued && activeQueue && <QueueButton onClick={onClickQueueButton} />
      )}
      <EditButton onClick={onClickEditButton} />
    </Box>
  );
}
