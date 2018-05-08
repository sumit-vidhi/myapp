import { Component, OnInit } from '@angular/core';

import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})


export class SiteHeaderComponent implements OnInit {

  constructor(
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {;
  }
 
  public gotobottom(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#motivated');
		this.pageScrollService.start(pageScrollInstance);
	  }; 
}
