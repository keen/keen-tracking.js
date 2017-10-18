import { Component } from '@angular/core';

import { KeenService } from './keen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private keenService: KeenService) {

  }
}
