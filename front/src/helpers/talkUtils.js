export const getAssignedTalks = (talks, assignedSlots) => {
  return talks
    ? assignedSlots?.map((slot) => {
      return {
        id: slot.talk.id,
        startTime: slot.slot.startTime,
        date: slot.slot.date,
        name: slot.room.name,
      };
    })
    : [];
}