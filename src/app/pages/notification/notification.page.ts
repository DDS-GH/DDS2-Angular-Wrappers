import { Component } from "@angular/core";

@Component({
  templateUrl: "./notification.page.html"
})
export class NotificationPageComponent {
  public ddsOptions: any = {
    closeIcon: true,
    title: "title",
    messageBody: "messageBody",
    timeStamp: `now`,
    primaryAction: ()=>{alert('hello')},
    primaryActionText: "primaryActionText",
    secondaryAction: ()=>{
        // @ts-ignore
        window.top.location.href="http://www.dell.com/"
    },
    secondaryActionText: "Go to Dell.com",
    titleIcon: "dds__icon--airplane", 
    titleIconType: "font-icon",
  };
  public timeout: number = 4;
}
