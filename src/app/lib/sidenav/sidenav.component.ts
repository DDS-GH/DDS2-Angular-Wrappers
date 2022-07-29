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
  private state: any = {};

  // @ts-ignore
  ngOnInit() {
    super.ngOnInit();
    this.ddsInitializer = `SideNav`;
    this.closeOnClick = stringToBoolean(this.closeOnClick);
  }

  // @ts-ignore
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    
    this.state.open = this.ddsElement.getAttribute(`aria-expanded`) === `true`;
    this.ddsElement.addEventListener(`ddsSideNavExpandedEvent`, () => {
        setTimeout(() => {
            this.state.open = true;
        });
    });
    this.ddsElement.addEventListener(`ddsSideNavCollapsedEvent`, () => {
        setTimeout(() => {
            this.state.open = false;
        });
    });

    if (this.closeOnClick) {
      this.ddsElement
        .querySelectorAll(`.dds__side-nav__item`)
        .forEach((el: any) => {
          el.addEventListener(`click`, (e: any) => {
            if (this.state.open) {
                this.ddsElement.SideNav.collapse();
            }
          });
        });
    }
  }
}
