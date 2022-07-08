import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DdsComponent } from '../helpers/dds.component';
import { stringToBoolean } from '../helpers/dds.helpers';

@Component({
  selector: `dds-messagebar`,
  templateUrl: `./messagebar.component.html`,
})
export class MessageBarComponent
  extends DdsComponent
  implements OnInit, AfterViewInit
{
  @Input() title: string = ``;
  @Input() icon: string = ``;
  @Input() variant: string = `informative`;
  @Input() dismissible: any = `true`;
  @Input() hide: any = `false`;
  @Input() layout: string = 'contextual';
  //   @Input() layout: "contextual" | "global" = "contextual";

  // @ts-ignore
  ngOnInit(): void {
    super.ngOnInit();
    this.dismissible = stringToBoolean(this.dismissible);
    this.ddsInitializer = `MessageBar`;
    if (!this.icon) {
      switch (this.variant) {
        case 'informative':
          this.icon = `alert-info-cir`;
          break;
        case 'success':
          this.icon = `alert-check-cir`;
          break;
        case 'warning':
          this.icon = `alert-notice`;
          break;
        case 'error':
          this.icon = `alert-error`;
          break;
      }
    }
    this.variant = `dds__message-bar--${this.variant}`;
    this.hide = stringToBoolean(this.hide);
    if (this.hide && this.classList.indexOf(`dds__d-none`) === -1) {
        this.classList += ` dds__d-none`;
    }
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.hide && !this.ddsElement.classList.contains(`dds__message-bar--hide`)) {
      this.close();
    }
  }

  close = () => {
    if (this.ddsComponent) this.ddsComponent.closeMessageBar();
  };

  open = () => {
    this.classList = this.classList.replace(/ dds__d-none/g, ``);
    if (this.ddsComponent) this.ddsComponent.showMessageBar();
  };
}
