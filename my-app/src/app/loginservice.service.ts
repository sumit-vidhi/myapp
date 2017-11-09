import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoginserviceService {

  constructor (
    private http: Http
  ) {}
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  /**
   *
   * @returns {Observable<T>}
   */
  isLoggedIn() : Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  /**
   *  Login the user then tell all the subscribers about the new status
   */
  login(data:any) : Observable<any> {
    return this.http.post("http://localhost:4300/getdata",data).map((response: Response) => {
      // login successful if there's a jwt token in the response
      let user = response.json();
      if (user  && user.id) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(user));
          this.isLoginSubject.next(true);
       return user;
      }
  })
}


  /**
   * Log out the user then tell all the subscribers about the new status
   */
  logout() : void {
    localStorage.removeItem('token');
    this.isLoginSubject.next(false);
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken() : boolean {
    return !!localStorage.getItem('token');
  }
}
