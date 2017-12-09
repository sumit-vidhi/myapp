import { 
	Component, 
	OnInit 
} 							from '@angular/core';

import { CNF } 				from '../../core/config';
import { ApiService } 	from '../../core/api.service';
import { AuthService } 	from '../../core/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth : AuthService) { }

  appName = CNF.appName;

  ngOnInit() {
  }

}
