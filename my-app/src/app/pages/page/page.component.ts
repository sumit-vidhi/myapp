import { 
  Component, 
  OnInit
}                             from '@angular/core';

import { 
  ActivatedRoute,
  Router, 
  ParamMap 
}                             from '@angular/router';

import {
  ApiService          
}                             from '../../core/api.service'; 


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit  {
  
  pageTemplate:string;

  constructor (
    private router : Router,
    private route : ActivatedRoute,
    private api : ApiService
  ){}

  loadPage(page){
    switch(page){
      case 'about_us':
        this.pageTemplate = "About Us";
        break;
      case 'term_condition':
        this.pageTemplate = "Term & Conditions";    
        break;
      case 'coming_soon':
        this.pageTemplate = "Coming Soon...";    
        break;
      case 'private_policy':
        this.pageTemplate = "Private Policy";    
        break;
      case 'support':
        this.pageTemplate = "Support";    
        break; 
      case 'advantages':
        this.pageTemplate = "Advantages";    
        break;  
      case 'preview':
        this.pageTemplate = "Preview";    
        break;
      case 'how-to-book-trainer':
        this.pageTemplate = "How to book a trainer";    
        break;       
    }
  }

  ngOnInit(){
    this.route.params.subscribe(params => this.loadPage(params.id));    
  }  
}
