import { Component } from "@angular/core";

class NotificationData{
  
  constructor(public elementId: string, public options: any, public timeout: number = 10){}
}

@Component({
  templateUrl: "./notification.page.html"
})
export class NotificationPageComponent {
  public ddsOptions: any = {
    closeIcon: true,
    title: "title",
    messageBody: "messageBody",
    timeStamp: `now`,
    titleIcon: "dds__icon--airplane", 
    titleIconType: "font-icon",
  };
  public timeout: number = 30;
  newNotificationList: NotificationData[] = [];
  notificationId = 1;

  newNotification(){
    // toggle the action buttons on or off
    let optionsToUse;
    if (this.notificationId%2 !== 0) {
        optionsToUse = {
            closeIcon: true,
            title: "title",
            messageBody: "messageBody",
            timeStamp: `now`,
            titleIcon: "dds__icon--airplane", 
            titleIconType: "font-icon",
            primaryAction: ()=>{alert('hello')},
            primaryActionText: "primaryActionText",
            secondaryAction: ()=>{
                // @ts-ignore
                window.top.location.href="http://www.dell.com/"
            },
            secondaryActionText: "Go to Dell.com",        
        }
    } else {
        optionsToUse = {
            closeIcon: true,
            title: "title",
            messageBody: "messageBody",
            timeStamp: `now`,
            titleIcon: "dds__icon--airplane", 
            titleIconType: "font-icon",
        };
    }
    // create a new notification
    let newNoti = new NotificationData(`notification${this.notificationId}`, optionsToUse, 3);
    this.newNotificationList.push(newNoti);
    this.notificationId += 1;
  }

  notificationClosed(data: any){
    let oldObj = this.newNotificationList.find((n:NotificationData) => n.elementId == data.elementId);
    if (oldObj){
      let index = this.newNotificationList.indexOf(oldObj);
      this.newNotificationList.splice(index, 1);
    }
  }
}
