import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export const toBarState = {
  init: "init",
  closed: "closed",
  open: "open",
};

@Injectable({
  providedIn: "root"
})
export class MessageBarService {
  private messageBarState = new BehaviorSubject(toBarState.init);
  currentState = this.messageBarState.asObservable();

  changeState(message: any) {
    this.messageBarState.next(message);
  }
}
