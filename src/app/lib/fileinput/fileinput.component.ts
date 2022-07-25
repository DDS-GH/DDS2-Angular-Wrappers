import { Component, Input } from '@angular/core';
import { DdsComponent } from '../helpers/dds.component';

@Component({
  selector: `dds-fileinput`,
  templateUrl: `./fileinput.component.html`,
})
export class FileInputComponent extends DdsComponent {
  @Input() button: string = `Browse Files`;
  @Input() error: string = `Error`;
  @Input() helper: string = ``;
  @Input() label: string = ``;
  @Input() accept: string = ``;
  public addUseSvg: boolean = false;

  override ngOnInit(): void {
    super.ngOnInit();
    if (document.querySelectorAll(`#dds__icon--upload`).length === 0) {
        this.addUseSvg = true;
    }
    this.ddsInitializer = `FileInput`;
  }
}
