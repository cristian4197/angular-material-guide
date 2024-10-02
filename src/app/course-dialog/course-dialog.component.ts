import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialog,  MatDialogConfig,  MatDialogRef} from '@angular/material/dialog';
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    // description: string;

    form = this.fb.group(
     {
        description: [this.course.description, Validators.required],
        category: [this.course.category, Validators.required],
        releasedAt: [new Date(), Validators.required],
        longDescription: [this.course.longDescription, Validators.required],
     }
    );

    constructor(
     private fb: FormBuilder,
    //  Para obtener referencia de la data de la funcion
     @Inject(MAT_DIALOG_DATA) private course: Course,
    //  Para obtener la referencia del dialog en la funcion
    private dialogRef: MatDialogRef<CourseDialogComponent>
    ) {


    }

    ngOnInit() {

    }

    close() {
        this.dialogRef.close();
    }

    save() {
        // Pasamos la data aquien haya invocado al dialogo
        this.dialogRef.close(this.form.value);
        // Este valor sera emitido por esta linea
        // return dialogRef.afterClosed()
    }



}


export function openEditCourseDialog(dialog: MatDialog, course: Course) {
    const config = new MatDialogConfig();
    // Desabilita la tecla escape para cerrar el dialogo
    config.disableClose = true;
    // habilita el focus en el input de entrada
    config.autoFocus = true;
    // pasa la data al dialogo
    config.data = {
        ...course
    };

    // Customizar estilos resposive
    // Contendor principal
    config.panelClass = 'modal-panel';
    // Clase del fondo de la modal
    config.backdropClass = 'backdrop-modal-panel';

    const dialogRef = dialog.open(CourseDialogComponent, config);

    return dialogRef.afterClosed();
}

