import React, { useEffect, useState } from 'react';
import { useSlots } from '#api/sockets-client';
import { useGetOpenSpace } from '#api/os-client';
import MainHeader from '#shared/MainHeader';
import { ScheduleIcon } from '#shared/icons';
import {
  RedirectToLoginFromOpenSpace,
  RedirectToRoot,
  usePushToOpenSpace,
} from '#helpers/routes';
import Spinner from '#shared/Spinner';
import { useUser } from '#helpers/useAuth';
import { ButtonSingIn } from '#shared/ButtonSingIn';
import { sortTimesByStartTime, byDate } from '#helpers/time';
import { DateSlots } from './DateSlots';
import { Tab, Tabs } from 'grommet';
import { compareAsc, format, isEqual } from 'date-fns';
import { ButtonMyTalks } from '../buttons/ButtonMyTalks';
import { isEqualsDateTime } from '../../../helpers/time';

const Schedule = () => {
  const user = useUser();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [activeDateIndex, setActiveDateIndex] = useState(0);

  const {
    data: { id, name, slots, organizer, dates = [], showSpeakerName } = {},
    isPending,
    isRejected,
  } = useGetOpenSpace();

  const sortedDates = dates.sort(compareAsc);
  const todaysDate = new Date(2024, 9, 2);

  useEffect(() => {
    const firstActiveIndex = sortedDates.findIndex((element) =>
      isEqualsDateTime(element, todaysDate)
    );
    if (firstActiveIndex !== -1) {
      setActiveDateIndex(firstActiveIndex);
    }
  }, [sortedDates]);

  const slotsSchedule = useSlots();
  const pushToOpenSpace = usePushToOpenSpace(id);

  if (isPending) return <Spinner />;
  if (isRejected || !dates.length) return <RedirectToRoot />;

  const talksOf = (slotId) =>
    slotsSchedule.filter((slotSchedule) => slotSchedule.slot.id === slotId);
  const amTheOrganizer = user && organizer.id === user.id;

  return (
    <>
      <MainHeader>
        <MainHeader.TitleLink onClick={pushToOpenSpace}>{name}</MainHeader.TitleLink>
        <MainHeader.SubTitle icon={ScheduleIcon} label="Agenda" />
        <MainHeader.Buttons>
          {user ? (
            <ButtonMyTalks amTheOrganizer={amTheOrganizer} />
          ) : (
            <ButtonSingIn onClick={() => setRedirectToLogin(true)} />
          )}
        </MainHeader.Buttons>
      </MainHeader>
      <Tabs activeIndex={activeDateIndex} onActive={setActiveDateIndex}>
        {sortedDates.map((date, index) => (
          <Tab
            key={index}
            title={format(date, 'yyyy-MM-dd')}
            style={
              activeDateIndex == index
                ? {
                    border: '2px solid #7D4CDB',
                    borderRadius: '5px',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    cursor: 'default',
                    textDecoration: 'none',
                  }
                : {}
            }
          >
            <DateSlots
              talksOf={talksOf}
              sortedSlots={sortTimesByStartTime(slots.filter(byDate(date)))}
              showSpeakerName={showSpeakerName}
            />
          </Tab>
        ))}
      </Tabs>
      {redirectToLogin && <RedirectToLoginFromOpenSpace openSpaceId={id} />}
    </>
  );
};
export default Schedule;
