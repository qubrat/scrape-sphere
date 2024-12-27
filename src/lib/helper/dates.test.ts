import { intervalToDuration } from 'date-fns';
import { datesToDurationString } from './dates';

jest.mock('date-fns', () => ({
	intervalToDuration: jest.fn()
}));

describe('datesToDurationString', () => {
	it('returns null when end or start is null or undefined', () => {
		expect(datesToDurationString(null, new Date())).toBeNull();
		expect(datesToDurationString(new Date(), null)).toBeNull();
		expect(datesToDurationString(undefined, new Date())).toBeNull();
		expect(datesToDurationString(new Date(), undefined)).toBeNull();
	});

	it('returns duration string when end and start are valid dates', () => {
		const start = new Date('2022-01-01T00:00:00.000Z');
		const end = new Date('2022-01-01T00:01:00.000Z');
		const duration = { minutes: 1, seconds: 0 };

		(intervalToDuration as jest.Mock).mockReturnValueOnce(duration);

		expect(datesToDurationString(end, start)).toBe('1min 0s');
	});

	it('returns duration string with milliseconds when duration is less than 1 second', () => {
		const start = new Date('2022-01-01T00:00:00.000Z');
		const end = new Date('2022-01-01T00:00:00.500Z');

		expect(datesToDurationString(end, start)).toBe('500ms');
	});
});
