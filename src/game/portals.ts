export type PortalConfig = {
	id: string;
	title: string;
	url: string;
	x: number;
	y: number;
};

export const portals: PortalConfig[] = [
	// Library Wing (left side, blue tiles) - Writeups
	{
		id: 'injecting-memories',
		title: 'Injecting Memories',
		url: 'writeups/injecting-memories-gpt5-pdf/',
		x: 48,
		y: 80,
	},
	{
		id: 'hidden-first-messages',
		title: 'Hidden First Messages',
		url: 'writeups/hidden-first-messages-opus4/',
		x: 48,
		y: 128,
	},
	{
		id: 'red-team-join',
		title: 'Red Team Join',
		url: 'writeups/red-team-join/',
		x: 48,
		y: 176,
	},
	{
		id: 'bad-timeline',
		title: 'Bad Timeline',
		url: 'writeups/the-bad-timeline-cognitive-insecurity/',
		x: 48,
		y: 224,
	},
	// Portal Chamber (right side, decorative tiles) - External Links
	{
		id: 'github',
		title: 'GitHub',
		url: 'https://github.com/c4554ndr4',
		x: 304,
		y: 96,
	},
	{
		id: 'future-forum',
		title: 'Future Forum',
		url: 'https://future.forum',
		x: 304,
		y: 160,
	},
];
