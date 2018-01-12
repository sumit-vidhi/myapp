import { Component, OnInit } from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	FormArray,
	Validators
} 	            from '@angular/forms';

import { 
  Router,ActivatedRoute 
}                       from '@angular/router';


@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css']
})
export class HeaderSearchComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    private route: ActivatedRoute,
    private router : Router
  ) { }

  searchForm : FormGroup;
  
    createSearchForm(search:string){
      this.searchForm = this.fb.group({
        search : search
      })
      this.onChanges();
    }

    onChanges(): void {
      this.searchForm.valueChanges.subscribe(val => {
        if(val.search === ''){
          this.router.navigate(['/']);
        }else if(val.search.length>1){
          this.router.navigate(['/'],{ queryParams: { search: val.search}});
        }
      });
    }
  
    onSearch(){
      if(this.searchForm.valid){
        let searchVal = this.searchForm.get('search').value;
        if(searchVal !== ''){
          this.router.navigate(['/'],{ queryParams: { search: searchVal}});
        }else{
          this.router.navigate(['/']);
        }
      }
    }
  
    ngOnInit() {
      this.route.queryParams
      .subscribe(params => {
        this.createSearchForm(params['search']);
      });
    }

}
