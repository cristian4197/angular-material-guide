import {Component} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

const SIMPLE_TEXT = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat maiores rerum corrupti doloremque repudiandae officiis nam laborum numquam sapiente dicta reiciendis maxime dolores sed ex nostrum, sunt provident? Iure!Necessitatibus magni provident perferendis ullam asperiores aut possimus! Eius esse laudantium reprehenderit, unde, doloremque accusamus, laborum nisi minima sequi sapiente placeat necessitatibus fugit fuga maxime molestias! Nobis iusto dicta inPorro rem alias voluptatem nesciunt ea eaque dignissimos illo, voluptatum nobis expedita blanditiis sit a assumenda quod dolorum atque magnam velit necessitatibus. Dicta culpa laudantium esse. Ad eveniet error exercitationem?Tempora, molestias. A ullam nisi error voluptate nostrum sunt, aliquid eligendi veniam expedita aut at facere impedit rerum commodi architecto, veritatis velit! Sequi harum quaerat, laborum et nam similique dicta.'


@Component({
  selector: "create-course-step-1",
  templateUrl:"create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: [SIMPLE_TEXT, [Validators.required, Validators.minLength(3)]]
  });

  // Con esta funcion intentamos resaltar fechas determinadas con color rojo, para este caso particular el primer dia de cada mes
  // cellDate: es la fecha seleccionada
  // view: es la vista del mes/año
  // Se espera que la funcion retorne una lista de clases de activos en forma de cadena
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();
    // Si la vista no es mes no debe resaltar nada
    if(view !== 'month') { return ''};
    // Si la vista es mes y es el primer dia retornamos la clase personalizada
    // Y lo enlazamos en el html con mat-datepicker
    return date === 1 ? 'highlight-date' : '';

  };

  constructor(private fb: UntypedFormBuilder) {

  }

  get courseTitle() {
    return this.form.controls['title'];
  }

}
