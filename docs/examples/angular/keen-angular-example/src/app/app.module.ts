import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { KeenService } from './keen.service';
import { FirstPageComponent } from './first-page/first-page.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    SecondPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)    
  ],
  providers: [KeenService],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
