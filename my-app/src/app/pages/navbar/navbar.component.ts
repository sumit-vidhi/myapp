import { 
	Component, 
  OnInit 
  
} 							from '@angular/core';

import { Inject, ViewChild,  ElementRef } from '@angular/core';

import { DOCUMENT} from '@angular/common';

import { CNF } 				from '../../core/config';
import { ApiService } 	from '../../core/api.service';
import { AuthService } 	from '../../core/auth.service';
import { ChatService }       from '../../core/chat.service';


import{
	Router 
} 						from '@angular/router';

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  appName = CNF.appName;
  showLogoutDp:boolean;
  chat:boolean=false;
  displayClassBool:boolean;
  availble:any;
  avail:any;
  page:any;
  constructor(public auth : AuthService,
    private api : ApiService,public chatservice:ChatService,
		private pageScrollService: PageScrollService,
		private router : Router, 
		@Inject(DOCUMENT) private document: any) { 
        this.displayClassBool=false;
       
  }
 
gotochat(page:any){
  this.router.navigate(['/'+page]);
  this.chat=false;
}


  ngOnInit() {
    console.log(window.localStorage.getItem("page"));
    var self=this;
    this.showLogoutDp=false;
    this.chatservice.getMessages().subscribe(data=>{ if (data) { 
       self.chat=true;
    } 
   })
  

   
  if(this.auth.user){
    let data={"id":this.auth.user.id};
    this.api.getunreadmessage(data)
    .then((res)=>{
      if(res.code==200){
        self.chat=true;
      }
    })  


      if( window.localStorage.getItem("avail")!=null){
        this.availble= window.localStorage.getItem("avail");
      }
      else if(this.auth.user.availblity){
        
        this.availble=this.auth.user.availblity;

      }else{
        this.availble="Available";
      }
    }
   else{
      this.availble="Available";
    }
    // this.availble=this.auth.user.availblity;
  }

  public goToSearch(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#price');
		this.pageScrollService.start(pageScrollInstance);
	  }; 

  toggleClass(){
    this.displayClassBool =!this.displayClassBool;
  }

  changestatus(event){
    var self=this;
    var status={status:event.target.value};
    window.localStorage.setItem("avail",event.target.value);
    this.api.changestatus(status).then(function(res){
    if(res){
       self.showLogoutDp=!self.showLogoutDp;
       alert("Status changed successfully");
     
    }
   })
   
  }

 
  pricelist(){
    this.router.navigate(['/'],{ queryParams: { price: "price"}});
  }

}
