import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api/api.service';
import { AlertService } from './services/alert/alert.service';
import { Api } from './classes/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

	minimumApiVersion: string = '0.0.2';

	constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private apiService: ApiService, private alertService: AlertService) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.upgradeValidation();
		});
	}

	validateVersion(version: any[], minimumVersion: any[]) {
		if(version.length < 1) {
			return true;
		}
		if(parseInt(version[0], 10) < parseInt(minimumVersion[0], 10)) {
			return false;
		} else if(parseInt(version[0], 10) > parseInt(minimumVersion[0], 10)) {
			return true;
		} else {
			return this.validateVersion(version.slice(1), minimumVersion.slice(1));
		}
	}

	upgradeValidation() {
		this.apiService.getApi().subscribe((api: Api) => {
			let valid = this.validateVersion(api.apiVersion.split('.'), this.minimumApiVersion.split('.'))
			if(!valid) {
				this.alertService.presentAlert('Upgrade', `Your app appears to be out of date. Please download the latest version from the store.`);
			} else {
				this.splashScreen.hide();
			}
		}, err => {
			this.alertService.presentAlert('Error', `We weren't able to find an internet connection. Please validate you're connected to the internet and you have the latest version of the app.`);
		});
	}
}
