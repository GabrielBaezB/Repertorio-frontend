// src/app/features/registros/registro-list/registro-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { RegistroService } from '../../../core/services/registro.service';
import { Registro } from '../../../core/models/registro.model';

@Component({
  selector: 'app-registro-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './registro-list.component.html',
  styleUrls: ['./registro-list.component.scss']
})
export class RegistroListComponent implements OnInit {
  displayedColumns = ['nom1','nom2','nro','ano','materia','fesc','actions'];
  dataSource = new MatTableDataSource<Registro>();

  filterCtrl = new FormControl('');
  isSearchMode = false;
  currentTerm = '';

  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'createdAt';
  sortDirection = 'desc';
  loading = true;
  error = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private registroService: RegistroService) {}

  ngOnInit(): void {
    this.filterCtrl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(term => this.onFilterChange(term ?? ''));

    this.loadRegistros();
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort      = this.sort;
  // }

  private onFilterChange(term: string) {
    this.currentTerm   = term.trim();
    this.pageIndex     = 0;
    this.isSearchMode  = this.currentTerm.length > 0;
    this.loadRegistros();
  }

  loadRegistros(): void {
    this.loading = true;
    const sortParam = `${this.sortField},${this.sortDirection}`;
    const obs$ = this.isSearchMode
      ? this.registroService.globalSearch(this.currentTerm, this.pageIndex, this.pageSize, sortParam)
      : this.registroService.getAll      (this.pageIndex, this.pageSize, sortParam);

obs$.subscribe({
  next: data => {
    const filtrados = data.content.filter((r: Registro) =>
      (r.nom1?.trim().length ?? 0) > 0 ||
      (r.nro?.trim().length  ?? 0) > 0
    );
    this.dataSource.data = filtrados;
    this.totalItems      = data.totalElements;
    this.loading         = false;
  },
      error: err => {
        this.error   = 'Error cargando registros';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadRegistros();
  }

  onSortChange(sort: Sort): void {
    this.sortField     = sort.active  || this.sortField;
    this.sortDirection = sort.direction || this.sortDirection;
    this.loadRegistros();
  }
}
