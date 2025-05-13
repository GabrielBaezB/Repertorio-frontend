// src/app/core/interceptors/api.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const token = auth.getToken();

  // Añadir detalles de depuración
  console.log('Interceptando solicitud a:', req.url);

  // Clonar la solicitud con todos los encabezados necesarios
  let modifiedReq = req.clone({
    setHeaders: {
      'ngrok-skip-browser-warning': 'true'
    }
  });

  // Añadir token de autorización si existe
  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Registro detallado de la solicitud
  console.log('Solicitud modificada:', {
    url: modifiedReq.url,
    method: modifiedReq.method,
    headers: modifiedReq.headers.keys().map(k => `${k}: ${modifiedReq.headers.get(k)}`),
    params: modifiedReq.params.keys().map(k => `${k}: ${modifiedReq.params.get(k)}`)
  });

  return next(modifiedReq);
};
