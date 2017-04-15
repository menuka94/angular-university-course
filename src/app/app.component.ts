import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  courses$ : FirebaseListObservable<any>;
  lesson$ : FirebaseObjectObservable<any>;
  firstCourse: any;


  constructor(private af: AngularFire){
    this.courses$ = af.database.list('courses');
    this.courses$.subscribe(value => console.log(value));

    this.lesson$ = af.database.object('lessons/-Khmb1aj6X2hQdfDVh0k');
    this.lesson$.subscribe(value => console.log(value));

    this.courses$.map(courses => courses[0])
        .subscribe(
            course => this.firstCourse = course
        );
  }

  listPush(){
    this.courses$.push({description: "Test New Course"})
        .then(
            () => console.log('List Push done'),
            err => console.error(err)
        );
  }

  listRemove(){
    this.courses$.remove(this.firstCourse);
  }

  listUpdate(){
    this.courses$.update(this.firstCourse, {description: 'Angular 2 HTTP Modified'});
  }
}
