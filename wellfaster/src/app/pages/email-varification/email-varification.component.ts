import { 
  Component, 
  OnInit,
  Input 
}                       from '@angular/core';

import { 
  ActivatedRoute, 
  ParamMap 
}                       from '@angular/router';


import {
    ApiService          
}                        from '../../core/api.service'; 

@Component({
  selector: 'app-email-varification',
  templateUrl: './email-varification.component.html',
  styleUrls: ['./email-varification.component.css']
})


export class EmailVarificationComponent implements OnInit {

  constructor (
    private route : ActivatedRoute,
    private api : ApiService
  ){}

  isEmailConfirmed:boolean;
  
  ngOnInit() {
    this.isEmailConfirmed = false;
    this.route.params.subscribe(params => {
      this.api.confirm({ 
        id : params.id, 
        token : params.code 
      })
      .then(response => {
        if(response.code == 200) this.isEmailConfirmed = true; 
      })
    })	
  }

}
