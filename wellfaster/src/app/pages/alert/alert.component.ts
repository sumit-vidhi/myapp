import { Component, OnChanges } from '@angular/core';

import { AlertService }       from '../../core/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnChanges {

  constructor(private alert: AlertService){

  }

  dismissible = true;
  alerts: any = [];

  reset(): void {
    this.alerts = this.alerts.map((alert: any) => Object.assign({}, alert));
  }

  ngOnChanges(){
    this.alert.getMessage().subscribe(x => {
      this.alerts=x;
      console.log('this.alerts ===' + x);
    });
  }

}
