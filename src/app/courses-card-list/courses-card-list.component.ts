import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    cols = 3;

    rowHeight = '500px';

    constructor(
        private dialog: MatDialog,
        private responsive: BreakpointObserver) {
    }

    ngOnInit() {
        this.responsive.observe([
            // Tablet vertical
            Breakpoints.TabletPortrait,
            // Tablet Horizontal
            Breakpoints.TabletLandscape,
            // Celular vertical
            Breakpoints.HandsetPortrait,
            // Celular horizontal
            Breakpoints.HandsetLandscape
        ]).subscribe((result) => {
            const breakPoint = result.breakpoints;

            if(breakPoint[Breakpoints.TabletPortrait]) {
                this.cols = 1;
            }else if(breakPoint[Breakpoints.TabletLandscape]){
                this.cols = 2;
            } else if(breakPoint[Breakpoints.HandsetPortrait]){
                this.cols = 1;
                this.rowHeight = '430px'
            } else if(breakPoint[Breakpoints.HandsetLandscape]) {

            }
        })
    }

    editCourse(course:Course) {
        // LLAMAMOS A NUESTRO DIALOG
        openEditCourseDialog(this.dialog, course)
            .pipe(
                // Emitimos siempre y cuando existe un valor enviado al dialogo
                filter(val => !!val),
                tap((form) => { 
                    // Mostramos los valores obtenidos del dialogo
                    console.log(form);
                })
            )
            .subscribe()
    }

}









