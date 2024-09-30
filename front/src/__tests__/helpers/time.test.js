import { wrapTestCaseLogError } from '../../helpers/testUtils';
import {
  numberToTwoDigitNumber,
  numbersToTime,
  compareTimeByArray,
  compareTime,
  sortTimesByStartTime,
  toDate,
  byDate,
  isEqualsDateTime,
  isSameDate,
  getLastEndFromCollectionOfSlots,
} from '../../helpers/time';

describe('GIVEN numberToTwoDigitNumber func', () => {
  it('WHEN receives a number with more than two digits THEN return the same number', () => {
    expect(numberToTwoDigitNumber(10)).toBe('10');
    expect(numberToTwoDigitNumber(59)).toBe('59');
    expect(numberToTwoDigitNumber(100)).toBe('100');
  });

  it('WHEN receives a number with two digits THEN return the same number', () => {
    expect(numberToTwoDigitNumber(0)).toBe('00');
    expect(numberToTwoDigitNumber(1)).toBe('01');
    expect(numberToTwoDigitNumber(9)).toBe('09');
  });
});

describe('GIVEN numbersToTime func', () => {
  it('WHEN receives a string number THEN return the same value (no formatting)', () => {
    expect(numbersToTime('10:20')).toBe('10:20');
    expect(numbersToTime('01:59')).toBe('01:59');
    expect(numbersToTime('0:0')).toBe('0:0');
  });

  it('WHEN receives a number as array format THEN return hour with format HH:mm', () => {
    expect(numbersToTime([0, 0])).toBe('00:00');
    expect(numbersToTime([1, 5])).toBe('01:05');
    expect(numbersToTime([10, 23])).toBe('10:23');
    expect(numbersToTime([23, 3])).toBe('23:03');
  });
});

describe('GIVEN compareTimeByArray func', () => {
  it('WHEN receives two arrays with format [HH, mm] THEN should be -1 if first argument is lower than second argument, otherwise 1', () => {
    const samples = [
      { fstArg: '11:00', sndArg: '11:10' },
      { fstArg: '00:00', sndArg: '01:10' },
      { fstArg: '13:00', sndArg: '23:10' },
      { fstArg: '10:00', sndArg: '12:10' },
    ].map((s) => ({ fstArg: s.fstArg.split(':'), sndArg: s.sndArg.split(':') }));

    samples.forEach((sampleCase, index) => {
      wrapTestCaseLogError(() => {
        expect(compareTimeByArray(sampleCase.fstArg, sampleCase.sndArg)).toBe(-1);
        expect(compareTimeByArray(sampleCase.sndArg, sampleCase.fstArg)).toBe(1);
      }, `Failed at case ${index + 1} with fstArg: ${sampleCase.fstArg}, sndArg: ${sampleCase.sndArg}`);
    });
  });
});

describe('GIVEN compareTime func', () => {
  it('WHEN receives two arrays/strings with format [HH, mm]/HH:mm THEN should be -1 if first argument is lower than second argument, otherwise 1', () => {
    const samples = [
      { fstArg: '11:00', sndArg: '11:10' },
      { fstArg: '00:00', sndArg: '01:10' },
      { fstArg: '13:00', sndArg: '23:10' },
      { fstArg: '10:00', sndArg: '12:10' },
    ];
    const samplesAsArray = samples.map((s) => ({
      fstArg: s.fstArg.split(':'),
      sndArg: s.sndArg.split(':'),
    }));
    const allSamples = samples.concat(samplesAsArray);
    allSamples.forEach((sampleCase, index) => {
      wrapTestCaseLogError(() => {
        expect(compareTime(sampleCase.fstArg, sampleCase.sndArg)).toBe(-1);
        expect(compareTime(sampleCase.sndArg, sampleCase.fstArg)).toBe(1);
      }, `Failed at case ${index + 1} with fstArg: ${sampleCase.fstArg}, sndArg: ${sampleCase.sndArg}`);
    });
  });
});

describe('GIVEN sortTimesByStartTime func', () => {
  const buildTime = (st) => ({ startTime: st });

  it('WHEN times is empty THEN return empty', () => {
    const times = [];
    const expected = [];
    expect(sortTimesByStartTime(times)).toEqual(expected);
  });

  it('WHEN list have an element THEN return same list', () => {
    const anElement = buildTime('11:00');
    const times = [anElement];
    const expected = [anElement];
    expect(sortTimesByStartTime(times)).toEqual(expected);
  });

  it('WHEN list size is greather than 1 THEN return same list but sorted by startTime', () => {
    const times = [
      buildTime('10:10'),
      buildTime('11:00'),
      buildTime('10:20'),
      buildTime('23:15'),
      buildTime('23:31'),
      buildTime('23:12'),
      buildTime('00:15'),
      buildTime('10:12'),
      buildTime('11:10'),
      buildTime('02:05'),
      buildTime('10:30'),
      buildTime('10:15'),
    ];
    const expected = [
      buildTime('00:15'),
      buildTime('02:05'),
      buildTime('10:10'),
      buildTime('10:12'),
      buildTime('10:15'),
      buildTime('10:20'),
      buildTime('10:30'),
      buildTime('11:00'),
      buildTime('11:10'),
      buildTime('23:12'),
      buildTime('23:15'),
      buildTime('23:31'),
    ];
    const res = sortTimesByStartTime(times);
    expect(res.length).toBe(expected.length);
    expect(res).toEqual(expected);
  });
});

describe('GIVEN toDate func', () => {
  it('WHEN receives date string with format yyyy-MM-dd or array format THEN return Date object with these values', () => {
    const tests = [
      { date: '2024-01-01', expected: new Date(2024, 0, 1) },
      { date: [2024, 1, 1], expected: new Date(2024, 0, 1) },
      { date: '2023-08-14', expected: new Date(2023, 7, 14) },
      { date: [2023, 8, 14], expected: new Date(2023, 7, 14) },
      { date: '2033-12-31', expected: new Date(2033, 11, 31) },
      { date: [2033, 12, 31], expected: new Date(2033, 11, 31) },
      { date: new Date(2033, 11, 31), expected: new Date(2033, 11, 31) },
      { date: null, expected: null },
      { date: undefined, expected: undefined },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(toDate(t.date)).toEqual(t.expected);
      }, `Failed at case ${index + 1} with date: ${t.date}, expected: ${t.expected}`);
    });
  });
});

describe('GIVEN byDate func', () => {
  it('WHEN receives a date and object with the same date key THEN return truthy', () => {
    const tests = [
      {
        date: new Date(2024, 0, 1),
        slot: { date: new Date(2024, 0, 1) },
      },
      {
        date: new Date(2023, 7, 14),
        slot: { date: new Date(2023, 7, 14) },
      },
      {
        date: new Date(2033, 11, 31),
        slot: { date: new Date(2033, 11, 31) },
      },
      {
        date: [2023, 8, 14],
        slot: { date: new Date(2023, 7, 14) },
      },
      {
        date: '2033-12-31',
        slot: { date: new Date(2033, 11, 31) },
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(byDate(t.date)(t.slot)).toBeTruthy();
      }, `Failed at case ${index + 1} with date: ${t.date} and slot.date :${t.slot.date}`);
    });
  });

  it('WHEN receives a date and object with the not equals date key THEN return falsy', () => {
    const tests = [
      {
        date: new Date(2024, 0, 2),
        slot: { date: new Date(2024, 0, 1) },
      },
      {
        date: new Date(2022, 7, 14),
        slot: { date: new Date(2023, 7, 14) },
      },
      {
        date: new Date(2033, 11, 31),
        slot: { date: new Date(2033, 12, 31) },
      },
      {
        date: [2023, 8, 14],
        slot: { date: new Date(2023, 6, 14) },
      },
      {
        date: '2033-12-31',
        slot: { date: new Date(2042, 0, 31) },
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(byDate(t.date)(t.slot)).toBeFalsy();
      }, `Failed at case ${index + 1} with date: ${t.date} and slot.date :${t.slot.date}`);
    });
  });
});

describe('GIVEN getLastEndFromCollectionOfSlots func', () => {
  it('WHEN list is empty THEN return undefined', () => {
    const slots = [];
    expect(getLastEndFromCollectionOfSlots(slots)).toBeUndefined();
  });

  it('WHEN list is not empty THEN return endTime of last element', () => {
    const lastElem = { endTime: '11:15' };
    const slots = [{ endTime: '01:00' }, { endTime: '02:05' }, lastElem];
    expect(getLastEndFromCollectionOfSlots(slots)).toEqual(lastElem.endTime);
  });
});

describe('GIVEN isEqualsDateTime func', () => {
  it('WHEN both dates are equal THEN return truthy', () => {
    const tests = [
      {
        date1: new Date(2024, 0, 1),
        date2: new Date(2024, 0, 1),
      },
      {
        date1: new Date(2023, 7, 14),
        date2: new Date(2023, 7, 14),
      },
      {
        date1: new Date(2033, 11, 31),
        date2: new Date(2033, 11, 31),
      },
      {
        date1: [2023, 8, 14],
        date2: new Date(2023, 7, 14),
      },
      {
        date1: '2033-12-31',
        date2: new Date(2033, 11, 31),
      },
      {
        date1: '2024-09-06T03:00:00.000Z',
        date2: new Date('2024-09-06T03:00:00.000Z'),
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(isEqualsDateTime(t.date1, t.date2)).toBeTruthy();
        expect(isEqualsDateTime(t.date2, t.date1)).toBeTruthy();
      }, `Failed at case ${index + 1} with date1: ${t.date1} and date2 :${t.date2}`);
    });
  });

  it('WHEN both dates are not equal or both undefined/null THEN return falsy', () => {
    const tests = [
      {
        date1: new Date(2024, 0, 2),
        date2: new Date(2024, 0, 1),
      },
      {
        date1: new Date(2022, 7, 14),
        date2: new Date(2023, 7, 14),
      },
      {
        date1: new Date(2033, 11, 31),
        date2: new Date(2033, 12, 31),
      },
      {
        date1: [2023, 8, 14],
        date2: new Date(2023, 6, 14),
      },
      {
        date1: '2033-12-31',
        date2: new Date(2042, 0, 31),
      },
      {
        date1: '2024-09-06T03:00:00.000Z',
        date2: new Date(2042, 0, 31),
      },
      {
        date1: undefined,
        date2: new Date(2042, 0, 31),
      },
      {
        date1: null,
        date2: new Date(2042, 0, 31),
      },
      {
        date1: null,
        date2: null,
      },
      {
        date1: undefined,
        date2: undefined,
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(isEqualsDateTime(t.date1, t.date2)).toBeFalsy();
        expect(isEqualsDateTime(t.date2, t.date1)).toBeFalsy();
      }, `Failed at case ${index + 1} with date1: ${t.date1} and date2 :${t.date2}`);
    });
  });
});

describe('GIVEN isSameDate func', () => {
  it('WHEN both dates are equal THEN return truthy', () => {
    const tests = [
      {
        date1: new Date(2024, 0, 1),
        date2: new Date(2024, 0, 1),
      },
      {
        date1: new Date(2023, 7, 14, 3),
        date2: new Date(2023, 7, 14, 2),
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(isSameDate(t.date1, t.date2)).toBeTruthy();
        expect(isSameDate(t.date2, t.date1)).toBeTruthy();
      }, `Failed at case ${index + 1} with date1: ${t.date1} and date2 :${t.date2}`);
    });
  });

  it('WHEN both dates are not equal or both undefined/null THEN return falsy', () => {
    const tests = [
      {
        date1: new Date(2024, 0, 2),
        date2: new Date(2024, 0, 1),
      },
      {
        date1: new Date(2022, 7, 14),
        date2: new Date(2023, 7, 14),
      },
      {
        date1: new Date(2033, 11, 31),
        date2: new Date(2033, 12, 31),
      },
      {
        date1: undefined,
        date2: new Date(2042, 0, 31),
      },
      {
        date1: null,
        date2: new Date(2042, 0, 31),
      },
      {
        date1: null,
        date2: null,
      },
      {
        date1: undefined,
        date2: undefined,
      },
    ];

    tests.forEach((t, index) => {
      wrapTestCaseLogError(() => {
        expect(isSameDate(t.date1, t.date2)).toBeFalsy();
        expect(isSameDate(t.date2, t.date1)).toBeFalsy();
      }, `Failed at case ${index + 1} with date1: ${t.date1} and date2 :${t.date2}`);
    });
  });
});
