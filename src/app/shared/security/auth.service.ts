import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {AngularFireAuth, FirebaseAuthState} from "angularfire2";
import {AuthInfo} from "./auth-info";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Router} from "@angular/router";

@Injectable()
export class AuthService{
  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(private auth: AngularFireAuth, private router: Router) { }

  login(email, password): Observable<FirebaseAuthState>{
      return this.fromFirebaseAuthPromise(this.auth.login({email, password}));
  }

  fromFirebaseAuthPromise(promise): Observable<any>{
    const subject = new Subject<any>();
    promise
        .then(
            res => {
              const authInfo = new AuthInfo(this.auth.getAuth().uid);
              this.authInfo$.next(authInfo);
              subject.complete();
            },
            err => {
                this.authInfo$.error(err);
                subject.error(err);
                subject.complete();
            }
        );

    return subject;
  }

  signUp(email: string, password: string): Observable<FirebaseAuthState>{
      return this.fromFirebaseAuthPromise(this.auth.createUser({email, password}));
  }

  logout(){
      this.auth.logout();
      this.authInfo$.next(AuthService.UNKNOWN_USER);
      this.router.navigate(['/home']);
  }

}
