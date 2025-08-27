import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const HttpHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let cloneReq;

  if (req.headers.get('skip')) {
    // Nếu header có 'skip' thì bỏ nó đi
    cloneReq = req.clone({ headers: req.headers.delete('skip') });
  } else {
    // Nếu không có thì luôn bật withCredentials
    cloneReq = req.clone({ withCredentials: true });
  }

  if (req.headers.get('noRefresh')) {
    return next(cloneReq)
  } else{
    return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token hết hạn, thử refresh
        return authService.refreshToken$().pipe(
          switchMap((res) => {
            // ⚡ Cập nhật lại token vào localStorage/sessionStorage
            localStorage.setItem('accessToken', res.accessToken);

            // Retry request cũ với access token mới
            const retryReq = cloneReq.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Nếu refresh cũng fail thì logout
            authService.signout$();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
  }

};