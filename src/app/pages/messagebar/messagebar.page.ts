import { Component, ElementRef, ViewChild } from "@angular/core";
import { randomName } from "../../utilities/mock";

@Component({
  templateUrl: "./messagebar.page.html"
})
export class MessageBarPageComponent {
  @ViewChild(`ddsMbInstance`) ddsMbInstance!: ElementRef<HTMLElement>;

  public mb = {
    title: `Howl`,
    dismissible: true,
    layout: `global`,
    icon: `airplane`,
    variant: `error`,
    body: `Mouse is good you understand your place in my world and curse that dog i like big cats and i can not lie.`
  };

  update() {
    this.mb.title = randomName();
    this.mb.body = randomName(10);
  }

  hide() {
    // @ts-ignore
    this.ddsMbInstance.close();
  }

  show() {
    // @ts-ignore
    this.ddsMbInstance.open();
  }
}
