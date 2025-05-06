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
  searchForm: FormGroup;
  // displayedColumns: string[] = ['id', 'foj', 'nro', 'ano', 'materia', 'rut1', 'actions'];
  displayedColumns: string[] = ['nom1', 'nom2', 'ano', 'materia', 'actions'];
  registros: Registro[] = [];
  loading = false;
  error = '';
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searched = false;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService
  ) {
    this.searchForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nom1: [''],
      nom2: [''],
      // nro: [''],
      ano: [''],
      materia: [''],
    });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.performSearch();
  }

  performSearch(): void {
    this.loading = true;
    this.searched = true;
    this.error = '';

    // const params = { ...this.searchForm.value, page: this.pageIndex, size: this.pageSize };
    const { nom1, nom2, ano, materia } = this.searchForm.value;

    // Eliminar propiedades vacías
    // Object.keys(params).forEach(key => {
    //   if (params[key] === '' || params[key] === null) {
    //     delete params[key];
    //   }
    // });

    this.registroService
      .searchAdvanced(nom1, nom2, ano, materia, this.pageIndex, this.pageSize)
      .subscribe({
        next: data => {
          this.registros  = data.content;
          this.totalItems = data.totalElements;
          this.loading    = false;
        },
      error: (err) => {
        this.error = 'Error al buscar registros';
        this.loading = false;
        console.error('Error al buscar registros:', err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.performSearch();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.registros = [];
    this.searched = false;
    this.error     = '';
  }

  // Método para exportar todos los registros de un año a Excel
  exportToExcel(): void {
    const ano = this.searchForm.get('ano')?.value;

    if (!ano) {
      this.error = 'Debe especificar un año para exportar';
      return;
    }

    this.loading = true;

    this.registroService.exportToExcel(ano).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `registros_${ano}.xlsx`);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al exportar a Excel';
        this.loading = false;
        console.error('Error al exportar a Excel:', err);
      }
    });
  }

  // Método para exportar registros filtrados a Excel
  exportToExcelFiltered(): void {
    // Obtener los valores del formulario
    const params = { ...this.searchForm.value };

    // Eliminar propiedades vacías
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key];
      }
    });

    // Verificar si hay al menos un filtro
    if (Object.keys(params).length === 0) {
      this.error = 'Debe especificar al menos un criterio de búsqueda para exportar';
      return;
    }

    this.loading = true;

    this.registroService.exportToExcelFiltered(params).subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'registros_filtrados.xlsx');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al exportar a Excel';
        this.loading = false;
        console.error('Error al exportar a Excel:', err);
      }
    });
  }

  // Método para exportar un registro individual a PDF
  exportToPdf(id: number): void {
    this.loading = true;

    this.registroService.exportToPdf(id).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `registro_${id}.pdf`);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al exportar a PDF';
        this.loading = false;
        console.error('Error al exportar a PDF:', err);
      }
    });
  }

  // Método utilitario para descargar un archivo
  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  isFormValid(): boolean {
    // const formValues = this.searchForm.value;
    // Verificar si al menos uno de los campos tiene un valor
    // return Object.values(formValues).some(value => value !== '' && value !== null && value !== undefined);
    return Object.values(this.searchForm.value).some(v => !!v);
  }
}
