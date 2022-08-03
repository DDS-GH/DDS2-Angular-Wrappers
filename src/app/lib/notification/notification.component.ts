import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
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
  @Output() closed = new EventEmitter();
  private autoDismissEvent: any;

  override ngOnInit() {
    super.ngOnInit();
    const callbacks: Array<any> = [];
    let newClassName: string = ``; // to generate a unique class for hiding this instance.  Dell CSP forbids inline style usage
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
        newClassName = `ddsc__timeStamp--${this.elementId}`;
        this.classList += ` ${newClassName}`;
        callbacks.push(() => {
            this.addClass(newClassName, `#${this.elementId} .dds__notification__time-stamp {
                display: none !important;
            }`);
        });
    }
    if (!this.ddsOptions.primaryAction) {
        this.ddsOptions.primaryAction = ()=>{console.warn('')};
        newClassName = `ddsc__primaryAction--${this.elementId}`;
        this.classList += ` ${newClassName}`;
        callbacks.push(() => {
            this.addClass(newClassName, `#${this.elementId} .dds__notification__body .dds__button--primary {
                display: none !important;
            }`);
        });
    }
    if (!this.ddsOptions.primaryActionText) { this.ddsOptions.primaryActionText = '&nbsp;'; }
    if (!this.ddsOptions.secondaryAction) {
        this.ddsOptions.secondaryAction = ()=>{console.warn('')};
        newClassName = `ddsc__secondaryAction--${this.elementId}`;
        this.classList += ` ${newClassName}`;
        callbacks.push(() => {
            this.addClass(newClassName, `#${this.elementId} .dds__notification__body .dds__button--secondary {
                display: none !important;
            }`);
        });
    }
    if (!this.ddsOptions.secondaryActionText) { this.ddsOptions.secondaryActionText = '&nbsp;'; }
    if (!this.ddsOptions.notificationCount) { this.ddsOptions.notificationCount = 1; }
    if (!this.ddsOptions.titleIconType) { this.ddsOptions.titleIconType = 'font-icon'; }
    if (this.parentElement) {
        this.ddsComponent = DDS.Notification(this.ddsOptions, this.parentElement);
    } else {
        this.ddsComponent = DDS.Notification(this.ddsOptions);
    }

    this.ddsOptions.timeStamp = undefined;
    this.ddsOptions.primaryAction = undefined;
    this.ddsOptions.secondaryAction = undefined;

    /* -------------------------
    *  Notification, being a generated element, has no template to tap into, so we 
    *  must manually set ID and classes
    *  
    */
    setTimeout(() => {
        this.ddsElement = this.ddsComponent.element;
        this.ddsElement.id = this.elementId;
        if (this.classList.trim().length > 0) {
            this.classList.trim().split(' ').forEach(classname => {
                this.ddsElement.classList.add(classname);
            });
        }
        callbacks.forEach(cb => cb());
        this.ddsComponent.element.addEventListener("ddsNotificationClosingEvent", (data: any) => {
            data["elementId"] = this.elementId;
            this.closed.emit(data);
            if (this.timeout > 0) {
                clearTimeout(this.autoDismissEvent);
            }
        });
    }, 100);
    if (this.timeout > 0) {
        this.autoDismissEvent = setTimeout(() => {
            this.ddsComponent.hide();
        }, this.timeout * 1000);

    }
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.ddsComponent.element.id = this.elementId;
  }

  addClass(id: string, styles: string) {
    const styleId = `${id}_removal`;
    if (!document.getElementById(styleId)) {
        const css = document.createElement('style');
        css.id = styleId;
        css.appendChild(document.createTextNode(styles));
        setTimeout(() => {
            this.ddsElement.appendChild(css)
        });
    }
  }

  minutes(number: number) {
    return (number < 10 ? '0' : '') + number;
  }
}
