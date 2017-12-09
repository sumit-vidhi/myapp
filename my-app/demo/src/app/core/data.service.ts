import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

	constructor(private http: HttpClient) { 

	}

	getCountries(): Observable<any> {
		return this.http.get("assets/data/countries.json", httpOptions);
	}

	getStates(): Observable<any> {
		return this.http.get("assets/data/states.json", httpOptions);
	}

	getCities(): Observable<any> {
		return this.http.get("assets/data/cities.json", httpOptions);
	}

	getTimezones(): Observable<any> {
		return this.http.get("assets/data/timezones.json", httpOptions);
	}

	getLanguages(): Observable<any> {
		return this.http.get("assets/data/languages.json", httpOptions);
	}

	getTrainers(): Observable<any> {
		return this.http.get("assets/data/trainers.json", httpOptions);
	}

}		
