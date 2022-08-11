import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { Uuid } from "src/app/lib/helpers/dds.helpers";
import { injectComponent } from "src/app/lib/helpers/dds.injector";
import { TooltipComponent } from "src/app/lib/tooltip/tooltip.component";
import { randomNumber } from "src/app/utilities/mock";
import { debug } from "src/app/utilities/util";

@Component({
  templateUrl: './table-pagination.page.html',
  styleUrls: ['./table-pagination.page.scss'],
})
export class TablePaginationPageComponent implements AfterViewInit {
  @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
  @ViewChild(`paginationRef`) paginationRef!: ElementRef<HTMLElement>;
  public classList: string = `dds__table--compact`;
  public sortColumn: number = 0;
  public sortBy: string = `ascending`;
  public pool: any = {
    data: [],
    page: {
      current: 0,
      size: 6,
    },
  };
  public config: any = {
    columns: [
      {
        value: `Khakis`,
        sortBy: this.sortBy,
      },
      {
        value: `Cornish <tthold id="ht${Uuid()}" title="Tooltip Title">Tooltip Content</tthold>`,
      },
      {
        value: `Peking`,
      },
    ],
    data: this.refinePool(),
  };
  private tooltip: any = {};
  public selectedIndex?: string = undefined;
  public pagination: any = {
    perPageSelected: this.pool.page.size,
    perPageOptions: [6, 12, 24],
    options: {
      currentPage: this.pool.page.current,
      totalItems: this.pool.page.size,
    },
  };

  constructor(
    private viewContainerRef: ViewContainerRef,
    private applicationRef: ApplicationRef,
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    this.handleAdd(48);
    this.initializeTooltips();
    const linkPool = (e: any) => {
      this.pool.page.current = e.detail.currentPage - 1;
      this.pool.page.size = e.detail.pageSize;
      this.reinitializeTable();
    };
    const importantEvents = [
      `ddsTableSortEvent`,
      `ddsTableComponentRenderEvent`,
      `ddsTableHeadRowStyleUpdatedEvent`,
      `ddsTableHeadCellSortEvent`,
      `ddsTableHeadCellStyleUpdatedEvent`,
      `ddsTableHeadCellFocusChangedEvent`,
      `ddsTableComponentRenderEvent`,
      `ddsTableHeadRowSortEvent`,
      `ddsPaginationPageSizeChangedEvent`,
      `ddsPaginationPageChangedEvent`,
    ];
    importantEvents.forEach(ev => {
        if (ev.toLowerCase().indexOf(`pagination`) > -1) {
        // @ts-ignore
        this.paginationRef.ddsElement.addEventListener(
            `ddsPaginationPageChangedEvent`,
            linkPool
          );
        } else 
        // @ts-ignore
        this.myTable.ddsElement.addEventListener(
          `ddsPaginationPageChangedEvent`,
          linkPool
        );
    });
  }

  handleAdd(e: number = 1) {
    for (let i = 0; i < e; i++) {
      const current = new Date();
      current.setDate(current.getDate() + i);
      const num: number = Uuid();
      const ttData: any = {
        id: `tt${num}`,
        title: `Cock-a-Doodle-doo`,
        content: `I used to run a dating service for chickens, but I was struggling to make hens meet.`,
      };
      this.pool.data.push([
        { value: current },
        { value: `Quack ${num}<span class="dds__d-none rowId">${num}</span>` },
        {
          value: `Joke? <tthold id="${ttData.id}" title="${ttData.title}">${ttData.content}</tthold>`,
        },
      ]);
    }
    // @ts-ignore
    this.paginationRef.ddsComponent.setTotalItems(this.pool.data.length);
    this.reinitializeTable();
  }

  reinitializeTable() {
    this.config.data = this.refinePool();
    // @ts-ignore
    this.myTable.ddsElement.innerHTML = ``;
    // @ts-ignore
    if (this.myTable.ddsComponent.dispose) {
      // @ts-ignore
      this.myTable.ddsComponent.dispose();
    }
    // @ts-ignore
    this.myTable.initializeNow();
    // @ts-ignore
    this.myTable.ddsComponent.sort( this.sortColumn, this.sortBy );
    this.initializeTooltips();
  }

  handleSelect(e: any) {
    // @ts-ignore
    const tableRows = this.myTable.ddsElement.querySelectorAll(`.dds__tr`);
    const randIndx = randomNumber(0, tableRows.length);
    const selectedRow = tableRows[randIndx];

    // remove classes indicating selection
    // @ts-ignore
    this.myTable.ddsElement
      .querySelectorAll(`.selectedRow`)
      .forEach((r: any) => {
        r.classList.remove(`selectedRow`);
      });

    // select new random row, store its hidden ID at root
    if (selectedRow.querySelector(`.rowId`)) {
      this.selectedIndex = selectedRow.querySelector(`.rowId`).innerText;
    }

    // add selection classes
    selectedRow.querySelectorAll(`.dds__td`).forEach((c: any) => {
      c.classList.add(`selectedRow`);
    });
  }

  handleSort(e: any) {
    if (typeof e.detail === `number`) {
      switch (this.sortBy) {
        case `descending`:
          this.sortBy = `ascending`;
          break;
        case `ascending`:
          this.sortBy = `unsorted`;
          break;
        case `unsorted`:
          this.sortBy = `descending`;
          break;
      }
      // @ts-ignore
      this.myTable.ddsComponent.sort(this.sortColumn, this.sortBy);
    } else {
      this.sortBy = e.sortBy;
    }
    this.initializeTooltips();
  }

  handleSticky(e: any) {
    const sClass = ` dds__table--sticky-header custom-height`;
    if (this.classList.indexOf(sClass) > 0) {
      this.classList = this.classList.replace(sClass, ``);
    } else {
      this.classList = this.classList + sClass;
    }
  }

  refinePool() {
    const addLeadingZeros = (n: any) => {
      if (n <= 9) {
        return '0' + n;
      }
      return n;
    };
    const length = this.pool.data.length;
    const size = this.pool.page.size;
    const page = this.pool.page.current;
    let localSize = size;
    if (length === 0) {
      return [];
    }
    this.applySorting();
    if (length < page * size) {
      localSize = length;
    } else if (length < page * size + size) {
      localSize = length;
    }
    // convert dates to short display names
    this.pool.data.forEach((row: any) => {
        row.forEach((column: any) => {
            if (column.value instanceof Date) {
                const theDate = column.value.getFullYear() + "-" + addLeadingZeros(column.value.getMonth() + 1) + "-" + addLeadingZeros(column.value.getDate());
                column.value = theDate;
            }
        });
    });
    return this.pool.data.slice(page * size, page * size + localSize);
  }

  applySorting() {
    let self = this;
    if (this.pool.data[0][this.sortColumn].value instanceof Date) {
        if (this.sortBy === `ascending`) {
            this.pool.data.sort(function(a: any, b: any){
                return a[self.sortColumn].value - b[self.sortColumn].value;
            });
        } else {
            this.pool.data.sort(function(a: any, b: any){
                return b[self.sortColumn].value - a[self.sortColumn].value;
            });
        }
    }
  }

  initializeTooltips() {
    const element = this.viewContainerRef.element.nativeElement as HTMLElement;
    injectComponent(
      this.applicationRef,
      this.factoryResolver,
      this.injector,
      TooltipComponent,
      element.querySelectorAll('tthold')
    );
  }
}
