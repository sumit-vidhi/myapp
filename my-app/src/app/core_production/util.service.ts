import { Injectable } from '@angular/core';

@Injectable()

export class UtilService {

  constructor() { }

	time(arg?:string, n?:number){
  		var now = new Date();
  		var time  = now.getTime();
  		if(arg){
			switch(arg){
				case 'H' : 
					time = (n)? (time + (36000000*n)) : (time + 36000000);
					break;
				case 'D' : 
					time = (n)? (time + (86400000*n)) : (time + 86400000);
					break;
				case 'W' : 
					time = (n)? (time + (604800000*n)) : (time + 604800000);	
					break;	
	  		}
	  	}
	  	return time;	
	}

	date(y?:number,m?:number,d?:number){
  		var date = new Date();
			date = new Date();
			if(y) date.setFullYear(y,0,0);
			if(m) date.setMonth(--m);
			if(d) date.setDate(d);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		return date;
	}

	prevDay(){
		var date = this.date();
		date.setDate(date.getDate()-1);
		return date;
	}
	
	nextDay(){
		var date = this.date();
		date.setDate(date.getDate()+1);
		return date;
	}

	addToDate(arg?:string, n?:number){
		var date = this.date();
		if(arg){
			switch(arg){
				case 'DAY' : 
					if(n)
						date.setDate(date.getDate()+n);
					break	
				case 'MONTH' : 
					if(n)
						date.setMonth(date.getMonth()+n);
					break	

	  		}
	  	}
	  	return date;
	}

	toDate(date:Date){
		var date = new Date(date);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}

	format(format:string, date:Date){
		var date = new Date(date);
		let d = date.getDate();
		let D = date.getDay();
		let Y = date.getFullYear();
		let h = date.getHours();
		let m = date.getMinutes();
		let M = date.getMonth();
		let s = date.getSeconds();

		if(format === 'M/d/Y'){
			return M+'/'+d+'/'+Y;
		}
	}



}
