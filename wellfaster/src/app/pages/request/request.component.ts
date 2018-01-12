import { Component, OnInit } from '@angular/core';

import { 
  ActivatedRoute, 
  ParamMap 
}                   from '@angular/router';


import { 
  ApiService          
}                       from '../../core/api.service'; 



@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  constructor (
    private route : ActivatedRoute,
    private api : ApiService
  ){}

  requestStatus : string;
  requestingUser : string;
  
  ngOnInit() {
    this.requestStatus='';
    this.requestingUser='';
    this.route.params.subscribe(params => {
      this.api.acceptRequest({ 
        id : params.id,
        action:params.action
      })
      .then(response => {
        if(response.code == 200) {
          this.requestStatus = response.status;
          this.requestingUser = response.name;
        }  
      })
    })	
  }

}
