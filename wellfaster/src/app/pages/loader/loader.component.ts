import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../../core/loader.service';


export interface LoaderState {
  show: boolean;
}


@Component({
    selector: 'angular-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})

export class LoaderComponent{
  constructor(
    public loader: LoaderService
  ) { }

  
}