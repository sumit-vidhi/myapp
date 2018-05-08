import { Component, OnInit } from '@angular/core';
import { ApiService } 	from '../../core/api.service';

import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { AuthService } 	from '../../core/auth.service';


import { LoaderService } from '../../core/loader.service';

import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-trainees',
  templateUrl: './trainees.component.html',
  styleUrls: ['./trainees.component.css']
})
export class TraineesComponent implements OnInit {
  constructor(private api : ApiService,  private route: ActivatedRoute,
    private auth : AuthService,   private router:Router,
		private loader : LoaderService,
    private storage : StorageService) { }
    orders:Array<any>=[];
    orderstatus:Array<any>=[];
  ngOnInit() {
    let self = this;
		self.loader.show();
    this.api.getacceptedrequests()
		.then(function(res){
      console.log(res);
      if(res.code==200){
        self.loader.hide();
        self.orders=res.orders;
        self.orderstatus=res.orderstatus;
        self.loader.hide();
      }else{
        if(res.message=="user_not"){
          self.auth.logout();
       }
      }
     
      //window.location.href=res.url;
		})
		.catch(function(err){
		
		})
  }

  trimcomma(strv) {
    return strv.replace(/(^\s*,)|(,\s*$)/g, '');
  }

  accept(id:any){
    var self=this;
    self.loader.show();
    var data={"id":id,action:1};
    this.api.acceptRequest(data)
		.then(function(res){

      if(res.code==200){
        self.loader.hide();
        console.log(res);
        self.ngOnInit();
      }else{
        if(res.message=="user_not"){
          self.auth.logout();
       }
      }
     
		})
		.catch(function(err){
		
		})    
  }

  reject(id:any){
    var self=this;
    if(confirm("Are you sure you want to reject the user")) {
    self.loader.show();
    var data={"id":id,action:0};
    this.api.rejectRequest(data)
		.then(function(res){

      if(res.code==200){
        self.loader.hide();
        console.log(res);
        self.ngOnInit();
      }else{
        if(res.message=="user_not"){
          self.auth.logout();
       }
      }
     
		})
		.catch(function(err){
		
		})    
  }
}

}
