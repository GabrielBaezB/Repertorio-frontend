// features/admin/dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  activeUsers = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserStats();
  }
  loadUserStats(): void {
    this.userService.getAll().subscribe({
      next: (response) => {
        try {
          // Manejar diferentes formatos de respuesta
          const users = Array.isArray(response) ? response :
            (response?.content ? response.content : []);

          this.totalUsers = Array.isArray(response) ? users.length :
            (response?.totalElements || users.length);

          this.activeUsers = users.filter((user: User) =>
            user && user.enabled === true
          ).length;

          console.log(`Estadísticas cargadas: ${this.totalUsers} usuarios totales, ${this.activeUsers} activos`);
        } catch (e) {
          console.error('Error procesando datos de usuarios', e);
        }
      },
      error: (error) => {
        console.error('Error cargando estadísticas de usuarios', error);
      }
    });
  }
}
