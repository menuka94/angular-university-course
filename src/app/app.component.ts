import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private af: AngularFire){
    const courses$: FirebaseObjectObservable<any> = af.database.object('courses');
    courses$.subscribe(val => console.log(val));
  }
}
