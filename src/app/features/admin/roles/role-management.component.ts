// src/app/features/admin/roles/role-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Role } from '../../../core/models/role.model';
import { RoleService } from '../../../core/services/role.service';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss'
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  loading = false;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading roles', error);
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openRoleDialog(role?: Role): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '500px',
      data: role ? { ...role } : { name: '', description: '', permissions: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing role
          this.roleService.update(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Rol actualizado correctamente', 'Cerrar', { duration: 3000 });
              this.loadRoles();
            },
            error: (error: any) => {
              console.error('Error updating role', error);
              this.snackBar.open('Error al actualizar rol', 'Cerrar', { duration: 3000 });
            }
          });
        } else {
          // Create new role
          this.roleService.create(result).subscribe({
            next: () => {
              this.snackBar.open('Rol creado correctamente', 'Cerrar', { duration: 3000 });
              this.loadRoles();
            },
            error: (error: any) => {
              console.error('Error creating role', error);
              this.snackBar.open('Error al crear rol', 'Cerrar', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  // Modificar el método deleteRole
  deleteRole(role: Role): void {
    // Verificar que el rol tenga un ID antes de intentar eliminarlo
    if (!role.id) {
      this.snackBar.open('Error: El rol no tiene un ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    // Evitar eliminar roles fundamentales
    if (role.name === 'ROLE_ADMIN' || role.name === 'ROLE_USER') {
      this.snackBar.open('No se pueden eliminar roles fundamentales del sistema', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el rol "${this.roleService.displayRoleName(role.name)}"?`)) {
      this.roleService.delete(role.id).subscribe({
        next: () => {
          this.snackBar.open('Rol eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al eliminar rol', error);
          this.snackBar.open('Error al eliminar rol', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  displayRoleName(roleName: string): string {
    return this.roleService.displayRoleName(roleName);
  }
}
