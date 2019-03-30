import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Tournament } from 'src/app/classes/tournament';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {

	loadInterval;
	
	// Data
	tournaments: Tournament[];
	activeTournament;

	constructor(private api: ApiService, private alertService: AlertService) { }

	ngOnInit() {
		this.fetchScoreboard();

		this.loadInterval = setInterval(() => {
			this.fetchScoreboard();
		}, 30 * 1000);
	}
	
	fetchScoreboard() {
		this.alertService.presentLoading().then(loading => {
			this.api.getTournaments().subscribe((tournaments: Tournament[]) => {
				this.tournaments = tournaments;
				this.tournaments.forEach(tournament => {
					if(tournament.active)
					this.activeTournament = tournament;
				})

			}, err => {
				loading.dismiss();
				this.alertService.presentAlert('Error', 'Unable to load the latest tournament. Pull down to refresh.');
			});
		});
	}

}
