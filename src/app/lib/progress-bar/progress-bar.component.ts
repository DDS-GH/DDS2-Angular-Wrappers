import { Component, Input } from '@angular/core';
import { DdsComponent } from '../helpers/dds.component';

@Component({
  selector: 'dds-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent extends DdsComponent {
  @Input() label: string = ``;
  @Input() title: string = ``;
  @Input() helper: string = ``;

  // @ts-ignore
  ngOnInit() {
    super.ngOnInit();
    this.ddsInitializer = `ProgressBar`;
  }
}
