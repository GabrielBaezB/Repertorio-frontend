import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Role } from '../../../../core/models/role.model';
import { Permission } from '../../../../core/models/permission.model';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.scss'
})
export class RoleDialogComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;

  // Update to use Permission objects
  availablePermissions: Permission[] = [
    { id: 1, name: 'Crear usuarios', description: 'Permite crear usuarios', value: 'CREATE_USERS' },
    { id: 2, name: 'Ver usuarios', description: 'Permite ver usuarios', value: 'VIEW_USERS' },
    { id: 3, name: 'Actualizar usuarios', description: 'Permite actualizar usuarios', value: 'UPDATE_USERS' },
    { id: 4, name: 'Eliminar usuarios', description: 'Permite eliminar usuarios', value: 'DELETE_USERS' },
    { id: 5, name: 'Crear registros', description: 'Permite crear registros', value: 'CREATE_RECORDS' },
    { id: 6, name: 'Ver registros', description: 'Permite ver registros', value: 'VIEW_RECORDS' },
    { id: 7, name: 'Actualizar registros', description: 'Permite actualizar registros', value: 'UPDATE_RECORDS' },
    { id: 8, name: 'Eliminar registros', description: 'Permite eliminar registros', value: 'DELETE_RECORDS' },
    { id: 9, name: 'Exportar registros', description: 'Permite exportar registros', value: 'EXPORT_RECORDS' },
    { id: 10, name: 'Acceder a administración', description: 'Permite acceder a administración', value: 'ACCESS_ADMIN' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.id;
    this.initForm();
  }

  initForm(): void {
    // Si es un rol existente y tiene el prefijo ROLE_, lo quitamos para la UI
    let displayName = this.data.name || '';
    if (displayName.startsWith('ROLE_')) {
      displayName = displayName.substring(5);
    }

    // Crear el formulario base
    this.roleForm = this.fb.group({
      name: [displayName, [Validators.required, Validators.minLength(3)]],
      description: [this.data.description || ''],
      permissions: this.fb.group({})
    });

    // Añadir controles de checkbox para cada permiso
    const permissionsGroup = this.roleForm.get('permissions') as FormGroup;
    this.availablePermissions.forEach(permission => {
      // Check if the permission is included in the role's permissions
      const isSelected = this.data.permissions?.some(p =>
        (typeof p === 'string' && p === permission.value) ||
        (p && typeof p === 'object' && 'value' in p && p.value === permission.value)
      ) || false;

      permissionsGroup.addControl(permission.value, this.fb.control(isSelected));
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    // Obtener los valores del formulario
    const formValues = this.roleForm.value;

    // Extraer los permisos seleccionados
    const selectedPermissions: Permission[] = [];
    const permissionsGroup = formValues.permissions;
    if (permissionsGroup) {
      Object.keys(permissionsGroup).forEach(key => {
        if (permissionsGroup[key]) {
          const permission = this.availablePermissions.find(p => p.value === key);
          if (permission) {
            selectedPermissions.push(permission);
          }
        }
      });
    }

    // Construir el objeto de rol
    const roleData: Role = {
      id: this.data.id,
      name: formValues.name,  // El prefijo ROLE_ se añadirá en el servicio si es necesario
      description: formValues.description,
      permissions: selectedPermissions
    };

    this.dialogRef.close(roleData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
