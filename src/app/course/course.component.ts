import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { tap, catchError } from 'rxjs/operators';
import { throwError } from "rxjs";
import { Lesson } from '../model/lesson';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {
  
  course: Course;
  dataSource = new MatTableDataSource<Lesson>();
  load: boolean = false;
  displayColumns = ['select', 'seqNo', 'description', 'duration'];
  expandedLesson: Lesson = null;

  // Parámetros para la paginación
  pageSize: number = 3;
  totalItems: number = 0; // Número total de elementos en el backend
  pageCurrent: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Para selección de datos en la tabla
  // Primer parametros es si se permita la seleccion multiple de filas
  // La segunda es la fila inicial seleccionada
  selection = new SelectionModel<Lesson>(true, []);

  constructor(
    private route: ActivatedRoute, 
    private coursesService: CoursesService,  
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    // Carga inicial
    this.loadLessonsPage();
  }

  // Método para cargar las lecciones con paginación
  loadLessonsPage(): void {
    const pageIndex = this.paginator ? this.paginator.pageIndex : this.pageCurrent;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;

    this.coursesService.findLessons(
      this.course.id,
      'asc',
      pageIndex,    // Página actual
      pageSize      // Tamaño de la página
    )
    .pipe(
      tap((lessons) => {
        this.dataSource.data = lessons; // Asignar las lecciones al dataSource
        this.totalItems = lessons.length; // Total de elementos
        this.load = true; // Marca que la carga se completó
      }),
      catchError((err) => {
        console.error('Error loading lessons ', err);
        return throwError(err);
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      
      // Escuchar cambios en el paginador
      this.paginator.page
        .pipe(
          tap(() => this.loadLessonsPage()) // Cargar lecciones cada vez que se cambie de página
        )
        .subscribe();
    } else {
      console.error('Paginator not initialized!');
    }
    
    this.cd.detectChanges(); // Asegurarse de que el paginator esté correctamente sincronizado
  }

  // Metodo para expandir detalle de filas
  onToogleLesson(lesson:Lesson): void {
    if(lesson === this.expandedLesson) {
      this.expandedLesson = null;
    }else {
      this.expandedLesson = lesson;
    }

  }

  onLessonToogle(lesson:Lesson): void {
    this.selection.toggle(lesson);

    console.log(this.selection.selected);
    
  }

  // Verifica si todas las filas visibles están seleccionadas
isAllSelected(): boolean {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

// Verifica si alguna fila visible está seleccionada (estado indeterminado)
isSomeSelected(): boolean {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected > 0 && numSelected < numRows;
}

// Maneja la selección o deselección de todas las filas visibles
onToggleSelectAll(): void {
  if (this.isAllSelected()) {
    this.selection.clear(); // Deselecciona todas las filas
  } else {
    this.dataSource.data.forEach(row => this.selection.select(row)); // Selecciona todas las filas visibles
  }
}

}
