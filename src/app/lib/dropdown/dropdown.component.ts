import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";
import { debounce, throttle, stringToBoolean } from "../helpers/dds.helpers";

@Component({
  selector: `dds-dropdown`,
  templateUrl: `./dropdown.component.html`,
  styleUrls: [`./dropdown.component.scss`]
})
export class DropdownComponent extends DdsComponent implements OnChanges {
  @Input() label: string = ``;
  @Input() helper: string = ``;
  @Input() groups: any;
  @Input() useBackend: any = `false`;
  @Input() useXClear: any = `false`;
  @Input() warning: string = ``;
  @Input() placeholder: string = ``;
  @Output() onKeyUp: EventEmitter<string> = new EventEmitter<string>();
  @Output() optionSelected: EventEmitter<object> = new EventEmitter<object>();
  @Output() optionDeselected: EventEmitter<object> = new EventEmitter<object>();
  @Output() optionsCleared: EventEmitter<string> = new EventEmitter<string>();
  private listeners: Array<any> = [];
  private originalPlaceholder: string = ``;
  private inputField: any;

  override ngOnInit(): void {
    super.ngOnInit();
    this.ddsInitializer = `Dropdown`;
    this.useBackend = stringToBoolean(this.useBackend);
    this.useXClear = stringToBoolean(this.useXClear);
    this.parseData();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    const dropdownNotice = this.ddsElement.querySelector(`.dds__dropdown__notice`);
    const dropdownInput = this.ddsElement.querySelector(`.dds__dropdown__input-field`);
    const dropdownClear = this.ddsElement.querySelector(`.dds__tag`);
    if (!this.originalPlaceholder) {
        this.originalPlaceholder = this.ddsElement.querySelector(`input`).placeholder;
        this.inputField = this.ddsElement.querySelector(`input`);
      }
    const handleUpFinal = () => {
      dropdownNotice.innerText = ``;
      this.onKeyUp.emit(dropdownInput.value);
    };
    const handleDownFinal = (e: any) => {
      const ignoredKeys = [`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`];
      if (!ignoredKeys.includes(e.key) && this.ddsOptions.noOptionsLabel) {
        dropdownNotice.innerText = this.ddsOptions.noOptionsLabel;
      }
    };
    const handleClearEvent = (e: any) => {
      if (!e.target.title) {
        // the "X" button doesn't have a title, but the button itself does
        this.optionsCleared.emit(this.ddsComponent.getValue());
      }
    };
    const handleKeyUp = debounce(() => handleUpFinal());
    const handleKeyDown = throttle((e: any) => handleDownFinal(e));
    if (this.useBackend && !this.listeners.includes(`backendKeys`)) {
      this.listeners.push(`backendKeys`);
      dropdownInput.addEventListener(`keyup`, handleKeyUp);
      dropdownInput.addEventListener(`keydown`, handleKeyDown);
    }
    if (dropdownClear && !this.listeners.includes(`dropdownClear`)) {
      this.listeners.push(`dropdownClear`);
      dropdownClear.addEventListener(`click`, handleClearEvent);
    }
    if (!this.listeners.includes(`clicking`)) {
      this.listeners.push(`clicking`);
      this.ddsElement.addEventListener(`click`, (e: any) => {
        const emitSelection = (el: any) => {
          let valueToSubmit: any;
          const dataValue = el.getAttribute("data-value");
            if (dataValue) {
              valueToSubmit = {
                value: dataValue,
                text: el.innerText.trim()
              };
            } else {
              valueToSubmit = el.innerText.trim();
            }
            if (!stringToBoolean(el.getAttribute(`data-selected`))) {
              this.optionDeselected.emit(valueToSubmit);
            } else {
              this.optionSelected.emit(valueToSubmit);
            }
        };
        if (
          e.target.classList &&
          e.target.classList.contains(`dds__dropdown__item-option`)
        ) {
          const isSelectAll = e.target.parentElement.classList.contains(`dds__dropdown__select-all`);
          const ddListEl = this.ddsElement.querySelector(`.dds__dropdown__list`);
          const ddOptions = ddListEl.querySelectorAll(`.dds__dropdown__item-option`)
          if (isSelectAll) {
            ddOptions.forEach((ddOption: any) => {
              if (!ddOption.parentElement.classList.contains(`dds__dropdown__select-all`)) {
                emitSelection(ddOption);
              }
            });
          } else {
            emitSelection(e.target);
          }
        }
      });
    }
    if (!this.listeners.includes(`changeevent`)) {
        this.listeners.push(`changeevent`);
        this.ddsElement.addEventListener(`ddsDropdownSelectionChangeEvent`, (e: Event) => {
            if (this.useXClear) {
                const clearButton = this.ddsElement.querySelector(`.ddsc__dropdown__button--clear`);
                if (this.ddsComponent.getValue().length > 0) {
                    clearButton.classList.remove(`dds__d-none`);
                    this.clearPlaceholder();
                  } else {
                    clearButton.classList.add(`dds__d-none`);
                    this.resetPlaceholder();
                  }
            }
        });
    }
  }

  parseData() {
    if (typeof this.groups === `string`) {
      this.groups = this.groups
        .replace(/\\'/g, "@p0z")
        .replace(/'/g, '"')
        .replace(/@p0z/g, "'");
      try {
        this.groups = JSON.parse(this.groups);
      } catch (e: any) {
        console.error(e.message);
        this.label = `Error parsing Dropdown Data`;
        this.groups = [];
        this.ddsInitializer = ``; // prevents Dropdown initialization
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes[`groups`] &&
      !changes[`groups`].firstChange &&
      changes[`groups`].currentValue !== changes[`groups`].previousValue
    ) {
      this.parseData();
    }
  }

  deselect(removalValue: any) {
    try {
      if (typeof removalValue === `string`) {
        this.ddsComponent.deselectOption(removalValue.trim());
      } else {
        this.ddsComponent.deselectOption(removalValue.value.trim());
      }
    } catch (e) {
      console.error(e, removalValue);
    }
  }

  reboot() {
    // as of this writing (currently ~v2.13.0), reintializing the Dropdown
    // leaves an extra selectAll element
    const selectAll = this.ddsElement.querySelector(
      `.dds__dropdown__select-all`
    );
    if (selectAll) {
      const firstSeparator = selectAll.parentElement.querySelector(
        `.dds__dropdown__list-separator`
      );
      selectAll.remove();
      firstSeparator.remove();
    }
    this.ddsComponent.dispose();
    this.initializeNow();
  }

  clearPlaceholder () {
    if (this.inputField) {
        this.inputField.removeAttribute(`placeholder`);
    }
  }
  
  resetPlaceholder () {
    if (this.inputField && this.originalPlaceholder) {
        this.inputField.setAttribute(`placeholder`, this.originalPlaceholder);
    }
  }

  handleClear() {
    this.ddsComponent.clearSelection();
  }
}
