import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Role } from '../../../../core/models/role.model';

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

  // Definir los permisos disponibles en el sistema
  availablePermissions = [
    { name: 'Crear usuarios', value: 'CREATE_USERS' },
    { name: 'Ver usuarios', value: 'VIEW_USERS' },
    { name: 'Actualizar usuarios', value: 'UPDATE_USERS' },
    { name: 'Eliminar usuarios', value: 'DELETE_USERS' },
    { name: 'Crear registros', value: 'CREATE_RECORDS' },
    { name: 'Ver registros', value: 'VIEW_RECORDS' },
    { name: 'Actualizar registros', value: 'UPDATE_RECORDS' },
    { name: 'Eliminar registros', value: 'DELETE_RECORDS' },
    { name: 'Exportar registros', value: 'EXPORT_RECORDS' },
    { name: 'Acceder a administración', value: 'ACCESS_ADMIN' }
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
      const isSelected = this.data.permissions?.includes(permission.value) || false;
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
    const selectedPermissions: string[] = [];
    const permissionsGroup = formValues.permissions;
    if (permissionsGroup) {
      Object.keys(permissionsGroup).forEach(key => {
        if (permissionsGroup[key]) {
          selectedPermissions.push(key);
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
