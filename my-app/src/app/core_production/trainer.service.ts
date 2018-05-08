import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';

import { ApiService } from './api.service';




import { AuthService } from './auth.service';

@Injectable()
export class TrainerService {

  constructor(private api :  ApiService, private auth : AuthService) { }


  // myUsers():Observable<any>{
  //   return Observable.fromPromise(this.api.myUsers());
  // }

}
