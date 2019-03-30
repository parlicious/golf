import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Tournament } from 'src/app/classes/tournament';
import { Leaderboard } from 'src/app/classes/leaderboard';
import { Picks, Participant } from 'src/app/classes/picks';
import { Player } from 'src/app/classes/player';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {

	loadInterval;
	error;
	
	// Data
	tournaments: Tournament[];
	activeTournament: Tournament;
	picks: Picks;
	leaderboard: Leaderboard;

	constructor(public navigation: NavController, private api: ApiService, private alertService: AlertService) { }

	ngOnInit() {
		this.fetchScoreboard();

		this.loadInterval = setInterval(() => {
			this.refreshScoreboard();
		}, 30 * 1000);
	}
	
	fetchScoreboard() {
		this.alertService.presentLoading().then(loading => {
			this.api.getTournaments().subscribe((tournaments: Tournament[]) => {
				this.tournaments = tournaments;
				this.tournaments.forEach(tournament => {
					if(tournament.active)
					this.activeTournament = tournament;
				});
				
				if(!this.activeTournament) {
					this.error = 'There are currently no active tournaments.';
					loading.dismiss();
				} else {
					this.refreshScoreboard().then(() => {
						loading.dismiss();
					}, err => {
						loading.dismiss();
					});
				}
			}, err => {
				loading.dismiss();
				this.alertService.presentAlert('Error', 'Unable to load the latest tournament. Pull down to refresh.');
			});
		});
	}

	refreshScoreboard() {
		return new Promise((resolve, reject) => {
			Promise.all([
				this.api.get(this.activeTournament.leaderboard),
				this.api.get(this.activeTournament.picks),
			]).then((results: [Leaderboard, Picks]) => {
				this.leaderboard = results[0];
				let picks = results[1];

				picks.pool_participants.forEach((participant: Participant) => {
					participant.score = 0;
					participant.picks.forEach((player: Player) => {
						let p = this.getPlayer(player);
						p.score = p.score ? p.score : 0;
						participant.score += p.score;
					});
				});
				picks.pool_participants.sort((a: Participant, b: Participant) => {
					return a.score - b.score;
				});
				this.picks = picks;
				resolve();
			}, err => {
				reject();
			});
		});
	}

	getPlayer(player: Player): Player {
		for(var i=0; i<this.leaderboard.players.length; i++) {
			if(this.leaderboard.players[i].id == player.id) {
				return this.leaderboard.players[i];
			}
		}
	}

	showParticipant(participant) {
		// this.navigation.navigateForward([''])
	}
}
