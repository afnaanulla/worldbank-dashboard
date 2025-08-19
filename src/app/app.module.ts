import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';

@NgModule({
  declarations: [
    // add other components here if they’re not standalone
  ],
  imports: [
    AppComponent,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true }
  ],
  bootstrap: []
})
export class AppModule {}
