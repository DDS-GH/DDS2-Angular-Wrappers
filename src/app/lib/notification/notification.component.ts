import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DdsComponent } from '../helpers/dds.component';
import { Uuid, stringToBoolean, setElementId } from '../helpers/dds.helpers';

declare const DDS: any;

@Component({
  selector: `dds-notification`,
  templateUrl: `./notification.component.html`
})
export class NotificationComponent extends DdsComponent {
  @Input() parentElement: any;
  @Input() timeout: number = 0;

  override ngOnInit() {
    super.ngOnInit();
    this.elementId = setElementId(this.elementId);
    if (this.ddsOptions.timeStamp === `now`) { 
        const now = (() => {
            const d = new Date(); return `${d.getHours()}:${this.minutes(d.getMinutes())}`;
        })();
        this.ddsOptions.timeStamp = now;
    }
    if (!this.ddsOptions.title) { this.ddsOptions.title = `&nbsp;`; }
    if (!this.ddsOptions.messageBody) { this.ddsOptions.messageBody = `&nbsp;`; }
    if (!this.ddsOptions.timeStamp) { 
        this.ddsOptions.timeStamp = `&nbsp;`; 
        this.addClass(`timeStamp`, `.dds__notification__time-stamp {
            display: none !important;
        }`);
    }
    if (!this.ddsOptions.primaryAction) {
        this.ddsOptions.primaryAction = ()=>{console.warn('')};
        this.addClass(`primaryAction`, `.dds__notification__body .dds__button--primary {
            display: none !important;
        }`);
    }
    if (!this.ddsOptions.primaryActionText) { this.ddsOptions.primaryActionText = '&nbsp;'; }
    if (!this.ddsOptions.secondaryAction) {
        this.ddsOptions.secondaryAction = ()=>{console.warn('')};
        this.addClass(`secondaryAction`, `.dds__notification__body .dds__button--secondary {
            display: none !important;
        }`);
    }
    if (!this.ddsOptions.secondaryActionText) { this.ddsOptions.secondaryActionText = '&nbsp;'; }
    if (!this.ddsOptions.notificationCount) { this.ddsOptions.notificationCount = 1; }
    if (!this.ddsOptions.titleIconType) { this.ddsOptions.titleIconType = 'font-icon'; }
    if (this.parentElement) {
        this.ddsComponent = DDS.Notification(this.parentElement);
    } else {
        this.ddsComponent = DDS.Notification(this.ddsOptions);
    }
    if (this.timeout > 0) {
        setTimeout(() => {
            this.ddsComponent.hide();
        }, this.timeout * 1000);
    }
  }

  addClass(id: string, styles: string) {
    const styleId = `${id}_removal`;
    if (!document.getElementById(styleId)) {
        const css = document.createElement('style');
        css.id = styleId;
        css.appendChild(document.createTextNode(styles));
        document.getElementsByTagName("head")[0].appendChild(css);
    }
  }

  minutes(number: number) {
    return (number < 10 ? '0' : '') + number;
  }
}
