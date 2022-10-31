import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";
import { stringToBoolean } from "../helpers/dds.helpers";

@Component({
  selector: `dds-table`,
  templateUrl: `./table.component.html`,
  styleUrls: [`./table.component.scss`]
})
export class TableComponent extends DdsComponent implements OnChanges {
  @Input() interactiveRows: any = `false`;
  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowClick: EventEmitter<any> = new EventEmitter<any>();

  override ngOnInit(): void {
    super.ngOnInit();
    this.interactiveRows = stringToBoolean(this.interactiveRows);
    this.ddsInitializer = `Table`;
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.ddsElement.addEventListener(`ddsTableSortEvent`, (e: any) => {
      this.onSort.emit(e.detail);
    });
    this.ddsElement.addEventListener(`ddsTableComponentRenderEvent`, (e: any) => {
        this.ddsElement.querySelectorAll(`.dds__tr`).forEach((el: any, intI: number) => {
            if (!el.getAttribute(`data-index`)) {
                if (this.interactiveRows) {
                    el.setAttribute(`tabindex`, 0);
                    el.addEventListener(`keyup`, (e: any) => {
                        if (e.key === `Enter`) {
                            this.handleRowClick(e);
                        }
                    });
                }
                el.setAttribute(`data-index`, intI);
                el.addEventListener(`click`, (e: any) => {
                    this.handleRowClick(e);
                });
            }
        })
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[`config`] && changes[`config`].firstChange) {
      return;
    }
  }

  handleRowClick(e: any) {
    if(!e.key || (e.key && e.target.classList.contains(`dds__tr`))) {
        this.onRowClick.emit(e);
    }
  }


}
