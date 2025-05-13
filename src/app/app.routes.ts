import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'registros',
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full'
      },
      {
        path: 'listar',
        loadComponent: () => import('./features/registros/registro-list/registro-list.component').then(m => m.RegistroListComponent)
      },
      {
        path: 'buscar',
        loadComponent: () => import('./features/registros/registro-search/registro-search.component').then(m => m.RegistroSearchComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./features/registros/registro-form/registro-form.component').then(m => m.RegistroFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./features/registros/registro-form/registro-form.component').then(m => m.RegistroFormComponent)
      },
      {
        path: 'ver/:id',
        loadComponent: () => import('./features/registros/registro-detail/registro-detail.component').then(m => m.RegistroDetailComponent)
      }
    ],
    canActivate: [authGuard]
  },
  // {
  //   path: 'perfil',
  //   loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent),
  //   canActivate: [authGuard]
  // },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      {
        path: 'usuarios',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/usuarios/listar/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () => import('./features/admin/usuarios/form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./features/admin/usuarios/form/user-form.component').then(m => m.UserFormComponent)
          }
        ]
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/admin/roles/role-management.component').then(m => m.RoleManagementComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./features/admin/configuracion/system-config.component').then(m => m.SystemConfigComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  },
  {
    path: 'debug',
    loadChildren: () => import('./debug/debug.module').then(m => m.DebugModule),
    canActivate: [authGuard, adminGuard], // Opcional: proteger con autenticación
    data: { roles: ['ADMIN'] } // Opcional: restringir a roles específicos
  }
];
