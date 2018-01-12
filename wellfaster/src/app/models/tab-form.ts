import { DataService }  from '../core/data.service';
import { Observable } from 'rxjs/Observable'

export class TabForm {
	
	constructor(
		public minTab:number, 
		public maxTab:number, 
		public dataService:DataService
	){
		this.minTab=minTab;
		this.maxTab=maxTab;
		this.activeTab=minTab;
		this.disabledTabs=[];
	}	

	public activeTab:number;
	public disabledTabs:any;

	public allCountries:any;
	public allStates:any;
	public allCities:any;
	public allTimezones:any;
	public allLanguages:any;


	public showTab(tabId:number){
		if(!this.isTabDisabled(tabId))
		  this.activeTab = tabId;
	}

	public isTabActive(tabId:number):boolean{
		return this.activeTab === tabId;
	}


	public isTabDisabled(tabId:number):boolean{
		return this.disabledTabs.indexOf(tabId) >= 0;
	}


	public makeActive(tabId:number){
		let i = this.disabledTabs.indexOf(tabId);
		if(i >= 0){
			this.disabledTabs.splice(i,1);
		}
		this.activeTab = tabId;
	}


	public goNext(){
		let nextTab = this.activeTab + 1;
		if(nextTab <= this.maxTab){
			this.makeActive(nextTab);
		}	
	}

	public goPrevious(){
		let prevTab = this.activeTab - 1;
		if(prevTab >= this.minTab){
			this.makeActive(prevTab);
		}
	}
	
	getCountries(): Observable<any> {
		return this.dataService.getCountries()
	}
	

	getStates(): Observable<any> {
		return this.dataService.getStates()
	}
	
	getLanguages(): Observable<any> {
		return this.dataService.getLanguages();
	}
	
	getTimezones(): Observable<any> {
		return this.dataService.getTimezones()
	}
}
