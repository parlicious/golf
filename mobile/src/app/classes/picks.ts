import { Player } from './player';

export class Participant {
	id: number;
	name: string;
	picks: Player[];
	score;
}

export class Picks {
	hash: string;
	timestamp: Date;
	pool_participants: Participant[];
}
