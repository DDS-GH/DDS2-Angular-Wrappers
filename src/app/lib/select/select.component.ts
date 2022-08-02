import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";

@Component({
  selector: `dds-select`,
  templateUrl: `./select.component.html`
})
export class SelectComponent extends DdsComponent {
  @Input() selectOptions!: Array<string>;
  @Input() label: string = ``;
  @Input() defaultValue: string = ``;
  @Input() placeholder: string = ``;
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();
  private selectedValue: string = ``;

  override ngOnInit() {
    super.ngOnInit();
    this.ddsInitializer = `Select`;
  }

  public onChange() {
    this.selectedValue = this.ddsElement.querySelector(`select`).value;
    this.optionSelected.emit(this.selectedValue);
  }
}
