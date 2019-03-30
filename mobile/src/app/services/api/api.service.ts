import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from 'src/app/classes/tournament';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

	constructor(private http: HttpClient) { }

	getApi() {
		return this.http.get(`${environment.apiUrl}/api.json`);
	}

	getTournaments() {
		return this.http.get(`${environment.apiUrl}/tournaments.json`);
	}
}
