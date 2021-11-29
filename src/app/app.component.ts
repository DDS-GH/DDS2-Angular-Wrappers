import { AfterViewInit, Component } from '@angular/core';
import { Accordion } from '@dds/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  accordion1Element: HTMLElement | null = null;
  accordion1Instance: Object | null = null;

  ngAfterViewInit() {
    this.accordion1Element = document.getElementById('accordion-1');
    this.accordion1Instance = new Accordion(this.accordion1Element);
  }
}
