import { Component, OnInit } from '@angular/core';
import { ApiService } 	from '../../core/api.service';

import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../core/storage.service';

import { LoaderService } from '../../core/loader.service';
import { AuthService } 	from '../../core/auth.service';
@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {

  constructor(private api : ApiService,  private route: ActivatedRoute, private auth : AuthService,  
		private storage : StorageService,
		private loader : LoaderService,  private router:Router) { }
  trainerId:any;
  token:any;
  mesg:any;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.trainerId=params['id']; //log the value of id
      this.token=params['id2'];
    });
   var self=this;
    var amount=this.storage.get("amount");
    let data={id:this.trainerId,user_id:this.auth.user.id,token:this.token,amount:amount};
    this.loader.show();
    this.api.checkpayment(data)
		.then(function(res){
     if(res.code==200){
      self.mesg="accept";
      self.loader.hide();
      if(res.response.accepted===true){
        var data={"id":self.auth.user.id,"trainerid":self.trainerId};
        console.log(self.storage.get("amount"));
        if(self.storage.get("amount")=="undefined" || window.localStorage.getItem("amount")==null ){
          self.api.paymentsucessplan(data).then(function(){
            self.mesg="accept";
          })
        }else{
          self.api.paymentsucess(data).then(function(){
            self.storage.clear("amount")
            self.mesg="accept";
          })
        }
       
       
       }
     }
    
     if(res.code==100){
      self.loader.hide();
      self.mesg="reject";
             
   
  }
  

		})
		.catch(function(err){
		
		})
  }


}
