import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { DdsComponent } from "../helpers/dds.component";

@Component({
  selector: `dds-table`,
  templateUrl: `./table.component.html`
})
export class TableComponent extends DdsComponent implements OnChanges {
  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowClick: EventEmitter<any> = new EventEmitter<any>();

  override ngOnInit(): void {
    super.ngOnInit();
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
                console.log('render');
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
    this.onRowClick.emit(e);
  }

}
