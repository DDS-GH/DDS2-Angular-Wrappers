import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as data from "./dropdown.page.json";
import * as dataMeow from "./dropdown2.page.json";

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
  @ViewChild(`ddRef1`) ddRef1!: ElementRef<HTMLElement>;
  @ViewChild(`ddRef2`) ddRef2!: ElementRef<HTMLElement>;
  public stored: Array<any> = [];
  public showTags: boolean = false;
  public data: any = data;
  public data2: any = [];
  public dataMeow: any = dataMeow;

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

  handleSelected(e: any) {
    console.log(e);
    this.data2 = this.dataMeow;
  }

  handleToggle() {
    this.data[0].options[1].hidden = !this.data[0].options[1].hidden;
  }

  handleReset() {
    this.data2 = [];
    // @ts-ignore
    this.ddRef2.ddsComponent.clearSelection();
  }
}
