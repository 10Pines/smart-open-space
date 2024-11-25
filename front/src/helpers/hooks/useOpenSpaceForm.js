import { useCallback } from 'react';
import { compareAsc } from 'date-fns';

// Custom hook to manage OpenSpace state updates
export const useOpenSpaceForm = (openSpace, setOpenSpace) => {
  const updateOpenSpace = useCallback(
    (key, value) => {
      setOpenSpace((prev) => ({ ...prev, [key]: value }));
    },
    [setOpenSpace]
  );

  const addItem = useCallback(
    (key, item, ref) => {
      setOpenSpace((prev) => ({ ...prev, [key]: [...prev[key], item] }));
      if (ref && ref.current) {
        ref.current.scrollToEnd();
      }
    },
    [setOpenSpace]
  );

  const removeItem = useCallback(
    (key, index) => {
      const updatedItems = removeItemAtIndex(openSpace[key], index);
      setOpenSpace((prev) => ({ ...prev, [key]: updatedItems }));
    },
    [openSpace, setOpenSpace]
  );

  const validate = useCallback(() => {
    const hasEmptyName = openSpace.name.trim() === '';
    const hasRepeatedTracks = openSpace.tracks.some(
      (track, index, self) => self.findIndex((t) => t.name === track.name) !== index
    );
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

  const addTrack = useCallback(
    (tracksRef) => {
      const newTracks = [
        ...openSpace.tracks,
        { name: '', description: '', color: '#3F8880' },
      ];
      setOpenSpace({ ...openSpace, tracks: newTracks });
      if (tracksRef.current) {
        tracksRef.current.scrollToEnd();
      }
    },
    [openSpace, setOpenSpace]
  );

  const addRoom = useCallback(
    (roomsRef) => {
      const newRooms = [...openSpace.rooms, { name: '', link: '' }];
      setOpenSpace({ ...openSpace, rooms: newRooms });
      if (roomsRef.current) {
        roomsRef.current.scrollToEnd();
      }
    },
    [openSpace, setOpenSpace]
  );

  const addDate = useCallback(
    (datesRef) => {
      const newDates =
        openSpace.dates.length > 0
          ? [
              ...openSpace.dates,
              datePlusOneDay(openSpace.dates[openSpace.dates.length - 1]),
            ]
          : [new Date()];
      setOpenSpace({ ...openSpace, dates: newDates });
      if (datesRef.current) {
        datesRef.current.scrollToEnd();
      }
    },
    [openSpace, setOpenSpace]
  );

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
    addItem,
    removeItem,
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

const datePlusOneDay = (date) => new Date(date.getTime() + 24 * 60 * 60 * 1000);
