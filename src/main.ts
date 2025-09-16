import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { tap } from 'rxjs';

function loggingInerceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  //   const req = request.clone({
  //     setHeaders: {
  //       Authorization: 'Bearer token',
  //     },
  //   });
  console.log('OutGoing Request');
  console.log(request);
  return next(request).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Incoming Response');
          console.log(event.status);
          console.log(event.body);
        }
      },
    })
  );
}
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingInerceptor]))],
}).catch((err) => console.error(err));
