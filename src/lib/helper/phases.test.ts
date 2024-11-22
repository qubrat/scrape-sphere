import { getPhasesTotalCost, Phase } from './phases';

describe('getPhasesTotalCost', () => {
	it('returns 0 when phases array is empty', () => {
		expect(getPhasesTotalCost([])).toBe(0);
	});

	it('returns total credits consumed when all phases have creditsConsumed', () => {
		const phases: Phase[] = [{ creditsConsumed: 10 }, { creditsConsumed: 20 }, { creditsConsumed: 30 }];
		expect(getPhasesTotalCost(phases)).toBe(60);
	});

	it('ignores phases with null creditsConsumed', () => {
		const phases: Phase[] = [{ creditsConsumed: 10 }, { creditsConsumed: null }, { creditsConsumed: null }, { creditsConsumed: 30 }];
		expect(getPhasesTotalCost(phases)).toBe(40);
	});

	it('handles large numbers of phases', () => {
		const phases: Phase[] = Array(1000).fill({ creditsConsumed: 10 });
		expect(getPhasesTotalCost(phases)).toBe(10000);
	});
});
