import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as data from "./dropdown.page.json";

interface DGroups {
  name: string;
  hidden: boolean;
  stored: Array<any>;
  options: Array<any>;
}

@Component({
  templateUrl: "./dropdown.page.html"
})
export class DropdownPageComponent implements OnInit {
  @ViewChild(`ddRef`) ddRef!: ElementRef<HTMLElement>;
  public stored: Array<any> = [];
  public showTags: boolean = false;
  public data: any = data;

  ngOnInit(): void {
    if (!this.data.sort) {
        const nonJsonMenu: any = [];
        Object.keys(this.data).forEach((key) => {
          if (this.data[key].options) {
            nonJsonMenu.push({
                name: this.data[key].icon,
                hidden: this.data[key].text,
                stored: this.data[key].tags,
                options: this.data[key].options
            });
          }
        });
        this.data = nonJsonMenu;
      }
  }

  handleToggle() {
    this.data[0].options[1].hidden = !this.data[0].options[1].hidden;
  }
}
