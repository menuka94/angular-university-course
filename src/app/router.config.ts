import {Route} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoursesComponent} from "./courses/courses.component";
import {CourseDetailComponent} from "./course-detail/course-detail.component";

export const routerConfig: Route[] = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'courses',
        children: [
            {
                path: ':id',
                component: CourseDetailComponent
            },
            {
                path: '',
                component: CoursesComponent
            }
        ]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];