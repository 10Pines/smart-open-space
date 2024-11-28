import { useCallback } from 'react';
import { compareAsc } from 'date-fns';
import { datePlusOneDay } from '#helpers/time';

// Custom hook to manage OpenSpace state updates
export const useOpenSpaceForm = (openSpace, setOpenSpace, refs) => {
  const validate = useCallback(() => {
    const hasEmptyName = openSpace.name.trim() === '';
    const hasRepeatedTracks = hasTracksWithRepeatedName(openSpace.tracks);

    return !hasEmptyName && !hasRepeatedTracks;
  }, [openSpace]);

  const isRepeatedTrack = useCallback(
    (tracks, track) =>
      tracks.filter((eachTrack) => eachTrack.name === track.name).length > 1,
    [],
    []
  );

  const hasTracksWithRepeatedName = useCallback(
    (tracks) => tracks.some((eachTrack) => isRepeatedTrack(tracks, eachTrack)),
    []
  );

  const changeTrack = useCallback(
    (track, index) => {
      const newTracks = [...openSpace.tracks];
      newTracks[index] = track;
      setOpenSpace({ ...openSpace, tracks: newTracks });
    },
    [openSpace, setOpenSpace]
  );

  const changeRoom = useCallback(
    (room, index) => {
      const newRooms = [...openSpace.rooms];
      newRooms[index] = room;
      setOpenSpace({ ...openSpace, rooms: newRooms });
    },
    [openSpace, setOpenSpace]
  );

  const changeDate = useCallback(
    (date, index) => {
      const newDates = [...openSpace.dates];
      newDates[index] = date;
      for (let i = index + 1; i < newDates.length; i++) {
        if (compareAsc(newDates[i], newDates[i - 1]) <= 0) {
          newDates[i] = datePlusOneDay(new Date(newDates[i - 1].getTime()));
        }
      }
      setOpenSpace({ ...openSpace, dates: newDates });
    },
    [openSpace, setOpenSpace]
  );

  const addTrack = useCallback(() => {
    const newTracks = [
      ...openSpace.tracks,
      { name: '', description: '', color: '#3F8880' },
    ];
    setOpenSpace({ ...openSpace, tracks: newTracks });
    if (refs.tracksRef.current) {
      refs.tracksRef.current.scrollToEnd();
    }
  }, [openSpace, setOpenSpace]);

  const addRoom = useCallback(() => {
    const newRooms = [...openSpace.rooms, { name: '', link: '' }];
    setOpenSpace({ ...openSpace, rooms: newRooms });
    if (refs.roomsRef.current) {
      refs.roomsRef.current.scrollToEnd();
    }
  }, [openSpace, setOpenSpace]);

  const addDate = useCallback(() => {
    const newDates =
      openSpace.dates.length > 0
        ? [
            ...openSpace.dates,
            datePlusOneDay(openSpace.dates[openSpace.dates.length - 1]),
          ]
        : [new Date()];
    setOpenSpace({ ...openSpace, dates: newDates });
    if (refs.datesRef.current) {
      refs.datesRef.current.scrollToEnd();
    }
  }, [openSpace, setOpenSpace]);

  const removeTrack = useCallback(
    (index) => {
      const updatedTracks = removeItemAtIndex(openSpace.tracks, index);
      setOpenSpace((prev) => ({ ...prev, tracks: updatedTracks }));
    },
    [openSpace, setOpenSpace]
  );

  const removeRoom = useCallback(
    (index) => {
      const updatedRooms = removeItemAtIndex(openSpace.rooms, index);
      setOpenSpace((prev) => ({ ...prev, rooms: updatedRooms }));
    },
    [openSpace, setOpenSpace]
  );

  const removeDate = useCallback(
    (index) => {
      const updatedDates = removeItemAtIndex(openSpace.dates, index);
      setOpenSpace((prev) => ({ ...prev, dates: updatedDates }));
    },
    [openSpace, setOpenSpace]
  );

  const removeItemAtIndex = useCallback((array, index) => {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }, []);

  return {
    validate,
    changeTrack,
    changeRoom,
    changeDate,
    addTrack,
    addRoom,
    addDate,
    removeTrack,
    removeRoom,
    removeDate,
  };
};

export default useOpenSpaceForm;
