import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AngularFireAuth, FirebaseAuthState} from "angularfire2";

@Injectable()
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  login(email, password): Observable<FirebaseAuthState>{
      return this.fromFirebaseAuthPromise(this.auth.login({email, password}));
  }

  fromFirebaseAuthPromise(promise): Observable<any>{
    const subject = new Subject<any>();
    promise
        .then(
            res => {
              subject.next(res);
              subject.complete();
            },
            err => {
                subject.error(err);
                subject.complete();
            }
        );

    return subject;
  }

}
