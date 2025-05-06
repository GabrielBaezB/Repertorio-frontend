import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../core/services/registro.service';
import { Registro } from '../../../core/models/registro.model';

@Component({
  selector: 'app-registro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RouterModule  // Añadir este import
  ],
  templateUrl: './registro-form.component.html',
  styleUrl: './registro-form.component.scss'
})
export class RegistroFormComponent implements OnInit {
  registroForm: FormGroup;
  isEditMode = false;
  registroId?: number;
  loading = false;
  error = '';
  submitted = false;

  materias = [
    'AUTORIZACIÓN PARA SALIR DEL PAÍS',
    'AUTORIZACIÓN Y MANDATO PARA ENAJENAR INMUEBLE',
    'CESIÓN DE DERECHOS',
    'CESIÓN DE DERECHOS LITIGIOSOS',
    'CESIÓN DE DERECHOS Y USUFRUCTO',
    'COMPRAVENTA',
    'COMPRAVENTA Y USUFRUCTO',
    'CONTRATO DE COMPRAVENTA DE BIEN RAÍZ',
    'CONTRATO DE PROMESA DE COMPRAVENTA',
    'DELEGACIÓN DE MANDATO',
    'HIPOTECA',
    'PODER',
    'TESTAMENTO',
    'OTROS'
  ];

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registroForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.registroId = +id;
      this.loadRegistro(this.registroId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      foj: [''],
      nro: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      bim: [''],
      nom1: [''],
      nom2: [''],
      cont: [''],
      materia: ['', [Validators.required]],
      fesc: [''],
      rut1: [''],
      rut2: [''],
      observacion: ['']
    });
  }

  loadRegistro(id: number): void {
    this.loading = true;
    this.registroService.getById(id).subscribe({
      next: (registro) => {
        this.registroForm.patchValue(registro);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el registro';
        this.loading = false;
        console.error('Error al cargar el registro:', err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registroForm.invalid) {
      return;
    }

    this.loading = true;
    const registro = this.registroForm.value as Registro;

    if (this.isEditMode && this.registroId) {
      this.registroService.update(this.registroId, registro).subscribe({
        next: () => {
          this.router.navigate(['/registros']);
        },
        error: (err) => {
          this.error = 'Error al actualizar el registro';
          this.loading = false;
          console.error('Error al actualizar el registro:', err);
        }
      });
    } else {
      this.registroService.create(registro).subscribe({
        next: () => {
          this.router.navigate(['/registros']);
        },
        error: (err) => {
          this.error = 'Error al crear el registro';
          this.loading = false;
          console.error('Error al crear el registro:', err);
        }
      });
    }
  }
}
