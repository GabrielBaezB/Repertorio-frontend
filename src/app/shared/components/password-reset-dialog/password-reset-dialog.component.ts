// src/app/shared/components/password-reset-dialog/password-reset-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Resetear Contraseña</h2>

    <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <p>Ingresa la nueva contraseña para el usuario.</p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nueva Contraseña</mat-label>
          <input
            matInput
            [type]="hidePassword ? 'password' : 'text'"
            formControlName="password">
          <button
            type="button"
            mat-icon-button
            matSuffix
            (click)="hidePassword = !hidePassword">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="passwordForm.get('password')?.hasError('required')">
            La contraseña es obligatoria
          </mat-error>
          <mat-error *ngIf="passwordForm.get('password')?.hasError('minlength')">
            La contraseña debe tener al menos 6 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar Contraseña</mat-label>
          <input
            matInput
            [type]="hideConfirmPassword ? 'password' : 'text'"
            formControlName="confirmPassword">
          <button
            type="button"
            mat-icon-button
            matSuffix
            (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
            La confirmación de contraseña es obligatoria
          </mat-error>
          <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
            Las contraseñas no coinciden
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="passwordForm.invalid">
          Resetear Contraseña
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class PasswordResetDialogComponent {
  passwordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PasswordResetDialogComponent>
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.get('password')?.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
