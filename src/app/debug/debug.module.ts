// src/app/debug/debug.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DebugApiComponent } from '../debug-api/debug-api.component';
import { DebugApiUserComponent } from '../debug-api-user/debug-api-user.component';
import { DebugApiRolesComponent } from '../debug-api-roles/debug-api-roles.component';
import { DebugExportComponent } from '../debug-export/debug-export.component';

const routes: Routes = [
  { path: '', redirectTo: 'api', pathMatch: 'full' },
  { path: 'api', component: DebugApiComponent },
  { path: 'users', component: DebugApiUserComponent },
  { path: 'roles', component: DebugApiRolesComponent },
  { path: 'export', component: DebugExportComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DebugApiComponent,
    DebugApiUserComponent,
    DebugApiRolesComponent,
    DebugExportComponent
  ]
})
export class DebugModule { }
