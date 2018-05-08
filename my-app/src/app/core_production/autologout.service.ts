import { Injectable } from "@angular/core";
import { Router } from '@angular/router'
const MINUTES_UNITL_AUTO_LOGOUT = 2 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY =  'lastAction';
@Injectable()
export class AutoLogoutService {
 public getLastAction() {
    return parseInt(localStorage.getItem("ty"));
  }
 public setLastAction(lastAction: number) {
    localStorage.setItem("ty", lastAction.toString());
  }

  constructor(private router: Router) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem("ty",Date.now().toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
      console.log(12121212);
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    console.log(timeleft);
    console.log(now);
    const isTimeout = diff < 0;
    console.log(isTimeout);
    if (isTimeout)  {
      localStorage.clear();
      this.router.navigate(['./login']);
    }
  }
}