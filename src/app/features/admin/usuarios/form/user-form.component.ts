// features/admin/usuarios/form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importar este módulo
import { Role } from '../../../../core/models/role.model';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  userId: number | null = null;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUser(this.userId);
      }
    });
  }
  // Método para mostrar nombres de roles sin prefijo ROLE_
  displayRoleName(roleName: string): string {
    return roleName.replace('ROLE_', '');
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      roles: [[], Validators.required],
      enabled: [true]
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        console.log('Usuario cargado:', user);

        // Extraer nombres de roles en lugar de IDs
        const roleNames = user.roles.map(role =>
          typeof role === 'string' ? role :
            (role.name ? role.name : `${role}`)
        );

        console.log('Nombres de roles extraídos:', roleNames);

        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          roles: roleNames, // Usar nombres en lugar de IDs
          enabled: user.enabled
        });

        // Deshabilitar el campo username en modo edición
        this.userForm.get('username')?.disable();

        // Hacer el campo password opcional en modo edición
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user', error);
        this.snackBar.open('Error al cargar el usuario', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles cargados:', roles);
      },
      error: (error) => {
        console.error('Error loading roles', error);
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const userData = { ...this.userForm.value };

    // Recuperar el username si está deshabilitado (modo edición)
    if (this.isEditMode) {
      userData.username = this.userForm.getRawValue().username;
    }

    // Si es edición y el campo password está vacío, eliminarlo
    if (this.isEditMode && (!userData.password || userData.password.trim() === '')) {
      delete userData.password;
    }


    if (this.isEditMode && this.userId) {
      this.userService.update(this.userId, userData).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/usuarios']);
        },
        error: (error) => {
          console.error('Error updating user', error);
          this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.userService.create(userData).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/usuarios']);
        },
        error: (error) => {
          console.error('Error creating user', error);
          this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
