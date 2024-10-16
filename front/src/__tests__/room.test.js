import { describe, test, expect } from 'vitest';
import { Room } from '../App/model/room';

describe('a room', () => {
  test('when their slots are asked, it sorts them by date', () => {
    const slotOnJanuary2022 = { date: [2022, 1, 1] };
    const slotOnDecember2022 = { date: [2021, 12, 2] };
    const slots = [slotOnJanuary2022, slotOnDecember2022];
    const room = new Room(slots);

    expect(room.slots()[0]).toBe(slotOnDecember2022);
    expect(room.slots()[1]).toBe(slotOnJanuary2022);
  });
  test('has id, description, name and slots', () => {
    const id = 1;
    const slots = [];
    const name = 'a name';
    const description = 'a Description';

    const room = new Room(slots, id, name, description);

    expect(room.slots()).toBe(slots);
    expect(room.id).toBe(id);
    expect(room.name).toBe(name);
    expect(room.description).toBe(description);
  });

  test('can get slots of certain date sorted by times', () => {
    const slotOnJanuary202210am = { date: [2022, 1, 1], startTime: [10, 0] };
    const slotOnJanuary202210pm = { date: [2022, 1, 1], startTime: [22, 0] };
    const slotOnDecember2022 = { date: [2, 12, 2021] };
    const room = new Room([
      slotOnJanuary202210pm,
      slotOnDecember2022,
      slotOnJanuary202210am,
    ]);

    const slots = room.slotsAt(new Date(2022, 0, 1));

    expect(slots.length).toBe(2);
    expect(slots[0]).toBe(slotOnJanuary202210am);
    expect(slots[1]).toBe(slotOnJanuary202210pm);
  });
});
