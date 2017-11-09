import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  private pagerTotalItems: number;
  private pagerPageSize: number;
  public keys: string;
  
  totalPages: number;
  pages: number[] = [];
  currentPage: number = 1;
  isVisible: boolean = false;
  previousEnabled: boolean = false;
  nextEnabled: boolean = true;
  

  @Input() get search():string {
    return this.keys;
  }

  set search(size:string) {
    this.keys = size;
    console.log(this.keys);
    this.update();
  }
  @Input() get pageSize():number {
    return this.pagerPageSize;
  }

  set pageSize(size:number) {
    this.pagerPageSize = size;
    this.update();
  }
  
  @Input() get totalItems():number {
    return this.pagerTotalItems;
  }

  set totalItems(itemCount:number) {
    this.pagerTotalItems = itemCount;
    this.update();
  }
  
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { 

  }
  
  update() {
    this.pages=[];
    if (this.pagerTotalItems && this.pagerPageSize) {
      this.totalPages = Math.ceil(this.pagerTotalItems/this.pageSize);
      this.isVisible = true;
      //console.log(this.totalPages);
      if (this.totalItems >= this.pageSize) {
        for (let i = 1;i < this.totalPages + 1;i++) {
          this.pages.push(i);
          console.log(this.pages);
        }
      }
      return;
    }
   
    
    this.isVisible = false;
  }
  
  previousNext(direction: number,search, event?: MouseEvent) {
    let page: number = this.currentPage;
    if (direction == -1) {
        if (page > 1) page--;
    } else {
        if (page < this.totalPages) page++;
    }
    this.changePage(page,search,event);
  }
  
  changePage(page: number,search:string, event?: MouseEvent) {
   // console.log(search);
    if (event) {
      event.preventDefault();
    }
    if (this.currentPage === page) return;
    this.currentPage = page;
    this.previousEnabled = this.currentPage > 1;
    this.nextEnabled = this.currentPage < this.totalPages;
    this.pageChanged.emit({page,search});
  }

}