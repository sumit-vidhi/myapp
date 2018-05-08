import { Component, OnInit } from '@angular/core';

import { AuthService } 	from '../../core/auth.service';
@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements OnInit {

  constructor(public auth : AuthService) { }

  ngOnInit() {
  }

}
