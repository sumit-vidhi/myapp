import { Component, OnInit ,ViewChild ,ElementRef  } from '@angular/core';
import { ApiService } 	from '../../core/api.service';

import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { AuthService } 	from '../../core/auth.service';


import { LoaderService } from '../../core/loader.service';

import { StorageService } from '../../core/storage.service';


declare function unescape(s:string): string;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  showDialognew = false;
  trainerId:any;
  traineremail:any;
  trainername:any;
  userplan:any;
  suscription:any;
  subscriptionId:any;
  @ViewChild('plan') plan: ElementRef;
  @ViewChild('plandown') plandown: ElementRef;
  @ViewChild('upgrade') upgrade : ElementRef;
  constructor(private api : ApiService,  private route: ActivatedRoute,
    public auth : AuthService,   private router:Router,
		private loader : LoaderService,
    private storage : StorageService) { }
    orders:Array<any>=[];
    orderstatus:Array<any>=[];
  ngOnInit() {
    let self = this;
		self.loader.show();
    this.api.getsubscription()
		.then(function(res){
      console.log(res);
      if(res.code==200){
        self.loader.hide();
        for(var i in res.orders){
          var number=self.getRandomInt(1, 100000);
          res.orders[i].name=unescape(res.orders[i].name);
          res.orders[i].trainerId=res.orders[i].trainerId;
          var date1 = new Date();
          var date2 = new Date( res.orders[i].end_date); //less than 1
          var start = Math.floor(date1.getTime() / (3600 * 24 * 1000)); //days as integer from..
          var end = Math.floor(date2.getTime() / (3600 * 24 * 1000)); //days as integer from..
          res.orders[i].daysDiff = end - start; // exact dates
          var name= res.orders[i].name.split(" ");
          res.orders[i].name=name[0];
        }
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

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
genrateactualnumber(vale,newval){
       var  vale = vale.toString();
       var  nw= newval.toString();
       var  existvalue= this.splitValue(nw,4,vale);
       console.log(existvalue);
       return existvalue;
  }
   splitValue(value, index,str) {
      return value.substring(0, index) + str;
  }

  deletesubscription(id:any,email:any,name:any,trainerid:any){
    var self=this;

    if(confirm("Are you sure? You are about to cancel the subscription")) {
    self.loader.show();
    var data={"id":id,"email":email,"name":name,"trainerid":trainerid};
    this.api.cancelsubscription(data)
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

changesubscription(id:any,email:any,name:any,trainerid:any,userplan:any,suscription:any){
  if(userplan=="premium"){
    //this.showDialognew=!this.showDialognew;
    let el: HTMLElement = this.plandown.nativeElement as HTMLElement;
    el.click();
  }else
  {
    this.showDialognew=!this.showDialognew;
  }
    this.trainerId=trainerid;
    this.traineremail=email;
    this.trainername=name;
    this.subscriptionId=id;
    this.userplan=userplan;
    if(userplan=="premium"){
      this.suscription="49";
    }else{
      this.suscription=suscription;
    }
   
 
  
}

nochange(){
  this.showDialognew=!this.showDialognew;
  let el: HTMLElement = this.plan.nativeElement as HTMLElement;
  el.click();
}
planchange(){
  this.showDialognew=!this.showDialognew;
  let el: HTMLElement = this.upgrade.nativeElement as HTMLElement;
  el.click();
}
createnewsubscription(){

      var self=this;
      self.loader.show();
      var data={"id":this.subscriptionId,"email":this.traineremail,"name":this.trainername,"trainerid":this.trainerId};
      this.api.cancelsubscription(data)
      .then(function(res){
        if(self.userplan=="entry"){
            var plan="premium";        }
        if(self.userplan=="premium"){
          var plan="entry";    
        }
       var data={id:self.trainerId,user_id:self.auth.user.id,plan:plan,amount:"",subscriptionplan:self.suscription};
        self.api.create_subscription(data)
        .then(function(res){
          self.loader.hide();
          if(res.code==200){
            window.location.href=res.url;
          }
         
          if(res.code==100){
           alert("Sorry,server is not responding right now please try later.")
          }
        
        })
        .catch(function(err){
        
        })
        self.ngOnInit();
      })
      .catch(function(err){
      
      })    
  

}

}
