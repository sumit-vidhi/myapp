import { Component, OnInit } from '@angular/core';

import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { ApiService }       from '../../core/api.service';
import {FormBuilder,FormGroup,Validators} 	from '@angular/forms';
import { MessageService } from '../../core/message.service';
import { AuthService } 	from '../../core/auth.service';
import { DataService }		from '../../core/data.service';

declare function unescape(s:string): string;
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {

  
	languages:any;
  trainerdetail:Array<any>;
  trainerId:any;
  constructor( 
    private fb  : FormBuilder,
    private route: ActivatedRoute,
    private message:MessageService,
    private auth : AuthService,
    private api : ApiService,
    private loader:LoaderService,
    private router:Router,
    private dataService : DataService,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    var self=this;
    this.route.params.subscribe(params => {
      this.trainerId=params['id']; //log the value of id
    });
    this.dataService.getLanguages().subscribe(x => self.languages = x);
    let id=this.trainerId;
    this.getdetails(id);
  }
  getdetails(id:any){
    this.loader.show();
    var self=this;
    let data={"id":id};
    this.api.getUserdetail(data)
    .then((res)=>{
      if(res.code == 200){

        self.gotobottom();
        this.loader.hide();
        res.data[0].description=unescape(res.data[0].description);
        // res.data[0].addtional_description=unescape(res.data[0].addtional_description);
        if(res.data[0].perferred_languages){

          res.data[0].perferred_languages=self.getlaungage(res.data[0].perferred_languages)
        }
        if(res.data[0].second_language){
          
          res.data[0].second_language=self.getlaungage(res.data[0].second_language)
        }
        self.trainerdetail=res.data[0];

        
       
       
      }else{

      }
    });
  }

  getlaungage(name:any){
    var lu=this.languages;
    for(let i in lu){
      if(lu[i].id==name){
       return lu[i].nativeName;
        }
    }
  }

  public gotobottom(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#details');
		this.pageScrollService.start(pageScrollInstance);
	  }; 

}
