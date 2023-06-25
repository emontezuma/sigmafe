import { Component, Input } from '@angular/core';
import { Mold } from '../../models/molds.models';

@Component({
  selector: 'app-mold-hits-counter',
  templateUrl: './mold-hits-counter.component.html',
  styleUrls: ['./mold-hits-counter.component.scss']
})
export class MoldHitsCounterComponent {
@Input() data: Mold;

}
