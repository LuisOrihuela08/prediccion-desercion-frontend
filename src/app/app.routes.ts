import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'analizar',
        loadComponent: () => import('./business/analizar/analizar/analizar.component').then(m => m.AnalizarComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./business/reportes/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'analizar',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'analizar',
      }
    ]
  }
];
