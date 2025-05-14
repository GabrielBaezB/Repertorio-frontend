// features/admin/usuarios/listar/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card'; // Añadir esta importación
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // También es necesario
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { PasswordResetDialogComponent } from '../../../../shared/components/password-reset-dialog/password-reset-dialog.component';
import { Role } from '../../../../core/models/role.model';

type RoleType = string | Role;

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchForm: FormGroup;
  displayedColumns: string[] = ['username', 'fullName', 'email', 'roles', 'enabled', 'actions'];
  loading = false;



  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      term: ['']
    });
  }

  ngOnInit(): void {
    console.log('Inicializando UserListComponent');
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Cargando usuarios...');
    this.loading = true;
    this.userService.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        console.log('Datos recibidos en el componente:', data);

        // Verificar formato de datos
        if (Array.isArray(data)) {
          console.log('Los datos son un array directamente');
          this.users = data;
          this.totalItems = data.length;
        } else if (data && data.content) {
          console.log('Los datos tienen formato de página');
          this.users = data.content;
          this.totalItems = data.totalElements;
        } else {
          console.error('Formato de datos inesperado:', data);
          this.users = [];
          this.totalItems = 0;
        }

        console.log(`Se cargaron ${this.users.length} usuarios`);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        console.error('Stack:', error.stack);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.users = []; // Inicializar con array vacío en caso de error
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleStatus(user.id, !user.enabled).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index].enabled = updatedUser.enabled;
        }
        this.snackBar.open(`Usuario ${updatedUser.enabled ? 'activado' : 'desactivado'} correctamente`, 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error toggling user status', error);
        this.snackBar.open('Error al cambiar estado del usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteUser(id: number): void {
    // Aquí podrías mostrar un diálogo de confirmación
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting user', error);
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  search(): void {
    const term = this.searchForm.get('term')?.value;
    if (!term || term.trim() === '') {
      this.resetSearch();
      return;
    }

    this.loading = true;
    this.userService.search(term, this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.users = data;
          this.totalItems = data.length;
        } else if (data && data.content) {
          this.users = data.content;
          this.totalItems = data.totalElements;
        } else {
          this.users = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching users', error);
        this.snackBar.open('Error al buscar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.pageIndex = 0;
    this.loadUsers();
  }
  resetPassword(userId: number): void {
    const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changePassword(userId, result).subscribe({
          next: () => {
            this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error resetting password', error);
            this.snackBar.open('Error al resetear contraseña', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  // Añadir este método
  displayRoleName(role: RoleType): string {
    if (typeof role === 'string') {
      return role.replace('ROLE_', '');
    } else if (role && typeof role === 'object' && role.name) {
      return role.name.replace('ROLE_', '');
    }
    return 'Desconocido';
  }
}
