// src/app/debug/debug-nav/debug-nav.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-debug-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 10px; background-color: #f5f5f5; margin-bottom: 20px; border-bottom: 1px solid #ddd;">
      <h1>Herramientas de Depuración</h1>
      <nav style="display: flex; gap: 15px; margin-top: 10px;">
        <a routerLink="/debug/api" routerLinkActive="active" style="padding: 8px 16px; text-decoration: none; color: #333; background-color: #e0e0e0; border-radius: 4px;">API Registros</a>
        <a routerLink="/debug/users" routerLinkActive="active" style="padding: 8px 16px; text-decoration: none; color: #333; background-color: #e0e0e0; border-radius: 4px;">API Usuarios</a>
        <a routerLink="/debug/roles" routerLinkActive="active" style="padding: 8px 16px; text-decoration: none; color: #333; background-color: #e0e0e0; border-radius: 4px;">API Roles</a>
        <a routerLink="/debug/export" routerLinkActive="active" style="padding: 8px 16px; text-decoration: none; color: #333; background-color: #e0e0e0; border-radius: 4px;">Exportación</a>
      </nav>
    </div>
  `,
  styles: [`
    .active {
      background-color: #3f51b5 !important;
      color: white !important;
    }
  `]
})
export class DebugNavComponent {}
