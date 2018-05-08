import { Component, OnInit } from '@angular/core';
import { ApiService } 	from '../../core/api.service';

import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { AuthService } 	from '../../core/auth.service';


import { LoaderService } from '../../core/loader.service';

import { StorageService } from '../../core/storage.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private api : ApiService,  private route: ActivatedRoute,
    private auth : AuthService,   private router:Router,
		private loader : LoaderService,
		private storage : StorageService) { }
  trainerId:any;
  entryprice:any;
  preminumprice:any;
  entrypricesubscription:any;
  preminumpricesubscription:any;
  unvalid:boolean;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.trainerId=params['id']; //log the value of id
    });
   // post.id=post.id.substring(4);
    let data={"id":this.trainerId};
    var self=this;
    this.api.getTrainerdetail(data)
    .then((res)=>{
      if(res.code == 200){
        self.unvalid=false;
        self.entryprice= res.data[0].price_premiumweek;
        self.preminumprice= res.data[0].weeklyprice;
        self.entrypricesubscription= res.data[0].pricesubscription_premiumweek;
        self.preminumpricesubscription= res.data[0].pricesubscription_week;

      }else{
         self.unvalid=true;
      }
    });
  }

  createpayment(plan:any,amount:any,subscription:any){
    this.loader.show();
    var self=this;
    this.storage.save("amount",amount);
    let data={id:this.trainerId,user_id:this.auth.user.id,plan:plan,amount:amount,subscriptionplan:subscription};
    this.api.create_subscription(data)
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
  }
 

}
