import { Injectable } from '@angular/core';
import { Observable}   from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class MessageService {

  constructor() {
    MessageService.instances++;
    console.log(' MessageService ==========' + MessageService.instances);
   }

   static instances = 0;
   msg:string;
   private subject = new Subject<any>();

   setMessage(msg){
    this.msg=msg;
    this.subject.next(this.msg);
   }

   getMessage(): Observable<any> {
    console.log('fasdfsdf');
    return this.subject.asObservable();
  }

}
