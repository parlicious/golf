import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

	constructor(private alertController: AlertController, private loadingController: LoadingController, private toastController: ToastController) { }

	async presentAlert(title, message) {
		let alert = await this.alertController.create({
			header: title,
			message: message,
			buttons: ['OK']
		});

		await alert.present();
		return alert;
	}

	async presentLoading(message = 'Loading...') {
		let loading = await this.loadingController.create({
			message: message
		});
		await loading.present();
		return loading;
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000
		});
		toast.present();
	}

	async presentDeleteConfirm(title, message, deleteCallback) {
		const alert = await this.alertController.create({
			header: title,
			message: message,
			buttons: [{
				text: 'Cancel',
				role: 'cancel',
				cssClass: 'secondary'
			}, {
				text: 'Delete',
				handler: () => {
					if(deleteCallback) {
						deleteCallback();
					}
				}
			}]
		});

		await alert.present();
	}
}
