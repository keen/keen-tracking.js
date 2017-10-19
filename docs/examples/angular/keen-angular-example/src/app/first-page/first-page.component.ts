import { Component, OnInit } from '@angular/core';
import { KeenService } from '../keen.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  private uiStack = 'Angular 2+';

  constructor( private keenService: KeenService ) { }

  ngOnInit() {
  }

  private uiStackValueChanged() {
    this.keenService.recordValueSelectedEvent( 'uiStackSurvey', 'uiStack', this.uiStack);
  }
}
