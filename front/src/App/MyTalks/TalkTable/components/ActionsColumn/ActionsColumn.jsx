import { Box } from 'grommet';
import { ActionButton } from './ActionButton';
import React from 'react';
import {
  DeleteIcon,
  EditIcon,
  QueueIcon,
  ScheduleIcon,
  TransactionIcon,
} from '#shared/icons';
import { InProgress } from 'grommet-icons';

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
        <ActionButton
          onClick={onClickScheduleButton}
          tooltipText="Agendar"
          icon={<ScheduleIcon />}
        />
      ) : (
        <ActionButton
          onClick={onClickRescheduleButton}
          tooltipText="Reagendar"
          icon={<TransactionIcon />}
        />
      )}
      <ActionButton
        onClick={onClickDeleteButton}
        tooltipText="Eliminar"
        icon={<DeleteIcon />}
      />
      {datum.isInqueue ? (
        <ActionButton
          onClick={onClickInQueueButton}
          tooltipText="Esperando turno"
          icon={<InProgress />}
        />
      ) : (
        datum.canBeQueued &&
        activeQueue && (
          <ActionButton
            onClick={onClickQueueButton}
            tooltipText="Encolar"
            icon={<QueueIcon />}
          />
        )
      )}
      <ActionButton
        onClick={onClickEditButton}
        tooltipText="Editar"
        icon={<EditIcon />}
      />
    </Box>
  );
}
