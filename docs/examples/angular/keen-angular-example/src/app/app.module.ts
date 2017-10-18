import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KeenService } from './keen.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [KeenService],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
