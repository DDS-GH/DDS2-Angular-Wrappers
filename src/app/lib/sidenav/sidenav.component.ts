import { Component, Input } from '@angular/core';
import { DdsComponent } from '../helpers/dds.component';
import { stringToBoolean, ddsIcon } from '../helpers/dds.helpers';

const icons: any = {
  left: ddsIcon(`chevron-left`),
  right: ddsIcon(`chevron-right`),
};

@Component({
  selector: `dds-sidenav`,
  templateUrl: `./sidenav.component.html`,
  styleUrls: [`./sidenav.component.scss`],
})
export class SidenavComponent extends DdsComponent {
  @Input() closeOnClick: any = false;

  // @ts-ignore
  ngOnInit() {
    super.ngOnInit();
    this.ddsInitializer = `SideNav`;
    this.closeOnClick = stringToBoolean(this.closeOnClick);
  }

  // @ts-ignore
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.closeOnClick) {
      this.ddsElement
        .querySelectorAll(`.dds__side-nav__item`)
        .forEach((el: any) => {
          el.addEventListener(`click`, () => {
            this.ddsElement.SideNav.collapse();
          });
        });
    }
  }
}
