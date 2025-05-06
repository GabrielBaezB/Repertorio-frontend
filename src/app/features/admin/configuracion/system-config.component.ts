// features/admin/configuracion/system-config.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SystemConfig } from '../../../core/models/system-config.model';
import { SystemConfigService } from '../../../core/services/system-config.service';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './system-config.component.html',
  styleUrl: './system-config.component.scss'
})
export class SystemConfigComponent implements OnInit {
  configs: SystemConfig[] = [];
  configForms: { [key: string]: FormGroup } = {};
  displayedColumns: string[] = ['key', 'value', 'description', 'actions'];
  loading = false;

  constructor(
    private systemConfigService: SystemConfigService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs(): void {
    this.loading = true;
    this.systemConfigService.getAll().subscribe({
      next: (configs) => {
        this.configs = configs;
        this.initConfigForms();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading configs', error);
        this.snackBar.open('Error al cargar configuraciones', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  initConfigForms(): void {
    this.configs.forEach(config => {
      this.configForms[config.id] = this.fb.group({
        value: [config.value]
      });
    });
  }

  updateConfig(config: SystemConfig): void {
    const formValue = this.configForms[config.id].value;

    const updatedConfig: SystemConfig = {
      ...config,
      value: formValue.value
    };

    this.systemConfigService.update(config.id, updatedConfig).subscribe({
      next: () => {
        this.snackBar.open('Configuración actualizada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating config', error);
        this.snackBar.open('Error al actualizar configuración', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getInputType(config: SystemConfig): string {
    switch (config.type) {
      case 'NUMBER':
        return 'number';
      case 'DATE':
        return 'date';
      case 'BOOLEAN':
        return 'checkbox';
      default:
        return 'text';
    }
  }
}
