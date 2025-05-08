// src/app/features/registros/registro-search/registro-search.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { RegistroService } from '../../../core/services/registro.service';
import { Registro } from '../../../core/models/registro.model';
import { PdfGeneratorService } from '../../../core/services/pdf-generator.service';

@Component({
  selector: 'app-registro-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './registro-search.component.html',
  styleUrl: './registro-search.component.scss'
})
export class RegistroSearchComponent {

  /* --------------------  estado  -------------------- */
  searchForm: FormGroup;
  displayedColumns: string[] = ['nom1', 'nom2', 'ano', 'materia', 'actions'];
  registros: Registro[] = [];
  loading   = false;
  error     = '';
  totalItems = 0;
  pageSize   = 10;
  pageIndex  = 0;
  searched   = false;

  /* --------------------  ctor  -------------------- */
  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private pdf: PdfGeneratorService          // << nuevo servicio
  ) {
    this.searchForm = this.fb.group({
      nom1: [''],
      nom2: [''],
      ano : [''],
      materia: ['']
    });
  }

  /* --------------------  búsqueda  -------------------- */
  onSearch(): void {
    this.pageIndex = 0;
    this.performSearch();
  }

  performSearch(): void {
    this.loading  = true;
    this.searched = true;
    this.error    = '';

    const { nom1, nom2, ano, materia } = this.searchForm.value;

    this.registroService
      .searchAdvanced(nom1, nom2, ano, materia, this.pageIndex, this.pageSize)
      .subscribe({
        next: ({ content, totalElements }) => {
          this.registros   = content;
          this.totalItems  = totalElements;
          this.loading     = false;
        },
        error: err => {
          this.error   = 'Error al buscar registros';
          this.loading = false;
          console.error(err);
        }
      });
  }

  onPageChange(ev: PageEvent): void {
    this.pageIndex = ev.pageIndex;
    this.pageSize  = ev.pageSize;
    this.performSearch();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.registros = [];
    this.searched  = false;
    this.error     = '';
  }

  /* --------------------  exportaciones  -------------------- */
  exportToExcel(): void { /* sin cambios */ }
  exportToExcelFiltered(): void { /* sin cambios */ }

  /** Genera el PDF en el cliente */
  exportToPdf(id: number): void {
    this.loading = true;
    this.pdf.generate(id).subscribe({
      next: ()   =>  this.loading = false,           // descarga completada
      error: err => {
        this.error   = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  /* --------------------  utilidades  -------------------- */
  private downloadFile(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  isFormValid(): boolean {
    return Object.values(this.searchForm.value).some(v => !!v);
  }
}
