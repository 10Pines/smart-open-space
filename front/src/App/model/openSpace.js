import { toDate } from '#helpers/time';

export class OpenSpace {
  constructor({
    activeQueue,
    amountOfTalks,
    assignableSlots,
    dates,
    description,
    endDate,
    endTime,
    finishedQueue,
    freeSlots,
    id,
    isActiveCallForPapers,
    name,
    organizer,
    pendingQueue,
    queueState,
    slots,
    startDate,
    startTime,
    toSchedule,
    tracks,
    urlImage,
  }) {
    this.activeQueue = activeQueue;
    this.amountOfTalks = amountOfTalks;
    this.assignableSlots = assignableSlots;
    this.description = description;
    this.endTime = endTime;
    this.finishedQueue = finishedQueue;
    this.freeSlots = freeSlots;
    this.id = id;
    this.isActiveCallForPapers = isActiveCallForPapers;
    this.name = name;
    this.organizer = organizer;
    this.pendingQueue = pendingQueue;
    this.queueState = queueState;
    this.slots = slots;
    this.startTime = startTime;
    this.toSchedule = toSchedule;
    this.tracks = tracks;
    this.urlImage = urlImage;

    this.endDate = toDate(endDate);
    this.startDate = toDate(startDate);
    this.dates = dates.map((date) => toDate(date));
  }
}