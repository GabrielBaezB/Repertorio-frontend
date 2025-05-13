import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RegistroService } from '../../../core/services/registro.service';
import { Registro } from '../../../core/models/registro.model';

@Component({
  selector: 'app-registro-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './registro-detail.component.html',
  styleUrl: './registro-detail.component.scss'
})
export class RegistroDetailComponent implements OnInit {
  registro?: Registro;
  loading = true;
  error = '';

  constructor(
    private registroService: RegistroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRegistro(+id);
    } else {
      this.error = 'ID no proporcionado';
      this.loading = false;
    }
  }

  loadRegistro(id: number): void {
    this.registroService.getById(id).subscribe({
      next: (registro) => {
        this.registro = registro;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el registro';
        this.loading = false;
        console.error('Error al cargar el registro:', err);
      }
    });
  }

  deleteRegistro(): void {
    if (!this.registro?.id) return;

    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      this.loading = true;
      this.registroService.delete(this.registro.id).subscribe({
        next: () => {
          this.router.navigate(['/registros']);
        },
        error: (err) => {
          this.error = 'Error al eliminar el registro';
          this.loading = false;
          console.error('Error al eliminar el registro:', err);
        }
      });
    }
  }
}
