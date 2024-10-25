export default class Talk {
  constructor(
    id,
    name,
    description,
    meetingLink,
    speaker,
    track,
    isMarketplaceTalk,
    speakerName,
    votes,
    queue,
    slots,
    openSpace
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.meetingLink = meetingLink;
    this.speaker = speaker;
    this.isMarketplaceTalk = isMarketplaceTalk;
    this.speakerName = speakerName;
    this.votes = votes;
    this.track = track;
    this.queue = queue;
    this.slots = slots;
    this.openSpace = openSpace;
  }

  canBeQueued() {
    return !this.isAssigned() && !this.isToSchedule();
  }

  isAssigned() {
    return this.isIn(this.slots.map((slot) => slot.talk));
  }

  isInqueue() {
    return this.isIn(this.queue);
  }

  isToSchedule() {
    return this.isIn(this.openSpace.toSchedule);
  }

  isIn(talks) {
    return talks.some((talk) => talk.id === this.id);
  }

  colorForTalkManagement() {
    return this.hasTrack() ? this.track.color : this.colorByState();
  }

  colorByState() {
    return this.isAssigned()
      ? 'status-ok'
      : `accent-${this.isToSchedule() ? 3 : this.isInqueue() ? 2 : 4}`;
  }

  hasTrack() {
    return this.track;
  }
}
