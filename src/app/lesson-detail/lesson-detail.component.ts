import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LessonsService} from "../shared/model/lessons.service";

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private lessonsService: LessonsService) { }

  ngOnInit() {
    let lessonUrl = this.route.snapshot.params['id'];
    let lesson$ = this.lessonsService.findLessonByUrl(lessonUrl);

    lesson$.subscribe(console.log);
  }

}
