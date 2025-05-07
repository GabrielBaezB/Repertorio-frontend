// src/app/core/interceptors/ngrok.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptando solicitud a:', req.url);
  // Verificar si la URL de la solicitud es para ngrok
  if (req.url.includes('ngrok') || req.url.includes('/api/')) {
    console.log('Añadiendo encabezado ngrok-skip-browser-warning');
    // Clonar la solicitud con el encabezado ngrok-skip-browser-warning
    const modifiedReq = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return next(modifiedReq);
  }

  // Si no es una URL de ngrok, continuar con la solicitud original
  return next(req);
};
