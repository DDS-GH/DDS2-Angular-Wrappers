import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { debounce, Uuid } from 'src/app/lib/helpers/dds.helpers';
import { injectComponent } from 'src/app/lib/helpers/dds.injector';
import { TooltipComponent } from 'src/app/lib/tooltip/tooltip.component';
import { randomNumber } from 'src/app/utilities/mock';
import { debug } from 'src/app/utilities/util';
import {
  MessageBarService,
  toBarState,
} from '../../lib/messagebar/messagebar.service';

@Component({
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePageComponent implements AfterViewInit {
  @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
  @ViewChild(`myPagination`) myPagination!: ElementRef<HTMLElement>;
  @ViewChild(`loader`) loader!: ElementRef<HTMLElement>;

  public tableId: string = `tableInstance`;
  public paginationId: string = `paginationInstance`;
  public loaderHidden: boolean = true; // global always starts hidden even if set to false here
  public classList: string = `dds__table--compact`;
  public sorting: string = `descending`;
  public mb = {
    title: `Error`,
    dismissible: true,
    layout: `global`,
    icon: `alert-info-cir`,
    variant: `error`,
    body: `No data is available to display.`,
  };
  public pool: any = {
    data: [],
    page: {
      current: 1,
      size: 5,
    },
  };
  public config: any = {
    columns: [
      {
        value: `Khakis`,
        sortBy: this.sorting,
        width: 200
      },
      {
        value: `Cornish <tthold id="ht${Uuid()}" title="Tooltip Title">Tooltip Content</tthold>`,
      },
      {
        value: `Peking`,
      },
    ],
    data: this.pool.data,
    pagination: {
      topics: [this.paginationId],
      rowsPerPage: this.pool.page.size,
      currentPage: this.pool.page.current,
    },
  };
  private emptyRow: Array<any> = [{ value: `` }, { value: `` }, { value: `` }];
  private listeners: Array<any> = [];
  public selectedIndex?: string = undefined;
  public paginationOptions: any = {
    perPageSelected: this.pool.page.size,
    perPageOptions: [5, 8, 13],
    options: {
      currentPage: this.pool.page.current,
      totalItems: this.pool.page.size,
    },
  };

  constructor(
    private viewContainerRef: ViewContainerRef,
    private applicationRef: ApplicationRef,
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private messageBarState: MessageBarService
  ) {}

  ngAfterViewInit(): void {
    // @ts-ignore
    this.loader.toggle();
    setTimeout(() => {
      this.handleAdd(35);
      this.addListeners();
      this.adjustRowContents();
      // @ts-ignore
      this.loader.toggle();
    }, 750);
  }

  addListeners() {
    const paginationEvents = [
      `ddsPaginationPreviousPageClickedEvent`,
      `ddsPaginationPageSizeChangedEvent`,
      `ddsPaginationPageChangedEvent`,
      `ddsPaginationNextPageClickedEvent`,
      `ddsPaginationLastPageClickedEvent`,
      `ddsPaginationFirstPageClickedEvent`,
    ];
    const tableEvents = [
      `ddsTableSortEvent`,
      `ddsTableComponentRenderEvent`,
      `ddsTableHeadRowStyleUpdatedEvent`,
      `ddsTableHeadCellSortEvent`,
      `ddsTableHeadCellStyleUpdatedEvent`,
      `ddsTableHeadCellFocusChangedEvent`,
      `ddsTableComponentRenderEvent`,
      `ddsTableHeadRowSortEvent`,
    ];
    this.listeners.forEach((listener) => {
      listener.removeEventListener(listener);
    });
    paginationEvents.forEach((pe) => {
      this.listeners.push(
        // @ts-ignore
        this.myPagination.ddsElement.addEventListener(pe, debounce(() => this.adjustRowContents(), 50))
      );
    });
    tableEvents.forEach((pe) => {
      this.listeners.push(
        // @ts-ignore
        this.myTable.ddsElement.addEventListener(pe, debounce(() => this.adjustRowContents(), 50))
      );
    });
  }

  handleAdd(e: number = 1) {
    if (this.pool.data[0] === this.emptyRow) {
      this.messageBarState.changeState(toBarState.closed);
      this.pool.data.pop();
    }
    for (let i = 0; i < e; i++) {
      const num: number = Uuid();
      const ttData: any = {
        id: `tt${num}`,
        title: `Cock-a-Doodle-doo`,
        content: `I used to run a dating service for chickens, but I was struggling to make hens meet.`,
      };
      this.pool.data.push([
        { value: `Quack ${num}<span class="dds__d-none rowId">${num}</span>` },
        { value: `Moo?` },
        {
          value: `Joke? <tthold id="${ttData.id}" title="${ttData.title}" class="dds__d-none">${ttData.content}</tthold>`,
        },
      ]);
    }
    this.reinitializeTable();
  }

  reinitializeTable() {
    this.config.data = this.pool.data;
    this.paginationOptions.options.totalItems = this.config.data.length;

    // @ts-ignore
    if (this.myPagination.ddsComponent.dispose) {
      // @ts-ignore
      this.myPagination.ddsComponent.dispose();
    }
    // @ts-ignore
    this.myPagination.initializeNow();

    // @ts-ignore
    this.myTable.ddsElement.innerHTML = ``;
    // @ts-ignore
    if (this.myTable.ddsComponent.dispose) {
      // @ts-ignore
      this.myTable.ddsComponent.dispose();
    }

    // @ts-ignore
    this.myTable.initializeNow();
    this.adjustRowContents();
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
      switch (this.sorting) {
        case `descending`:
          this.sorting = `ascending`;
          break;
        case `ascending`:
          this.sorting = `unsorted`;
          break;
        case `unsorted`:
          this.sorting = `descending`;
          break;
      }
      // @ts-ignore
      this.myTable.ddsComponent.sort(0, this.sorting);
    } else {
      this.sorting = e.sortBy;
    }
    this.adjustRowContents();
  }

  handleSticky(e: any) {
    const sClass = ` dds__table--sticky-header custom-height`;
    if (this.classList.indexOf(sClass) > 0) {
      this.classList = this.classList.replace(sClass, ``);
    } else {
      this.classList = this.classList + sClass;
    }
  }

  handleDelete(e: any) {
    this.pool.data.pop();
    if (this.pool.data.length === 0) {
      this.messageBarState.changeState(toBarState.open);
      this.pool.data.push(this.emptyRow);
    }
    this.reinitializeTable();
  }

  getPageSize() {
    if (this.myPagination) {
      // @ts-ignore
      return this.myPagination.ddsComponent.getPageSize();
    } else {
      return this.pool.page.size;
    }
  }

  getCurrentPage() {
    if (this.myPagination) {
      // @ts-ignore
      return this.myPagination.ddsComponent.getCurrentPage();
    } else {
      return this.pool.page.current;
    }
  }

  adjustRowContents() {
    const element = this.viewContainerRef.element.nativeElement as HTMLElement;
    injectComponent(
      this.applicationRef,
      this.factoryResolver,
      this.injector,
      TooltipComponent,
      element.querySelectorAll('tthold')
    );
    
    // While the DDS Table does not yet support adding and removing rows with an API call, we
    // must reinitialize the table, which can cause extra rows to appear when paging backwards
    // through the dataset. This will remove the extra rows, but it does have an unfortunate
    // flickering effect.
    // @ts-ignore
    const pageSize = this.myPagination.ddsComponent.getPageSize();
    // @ts-ignore
    const tableRows = this.myTable.ddsElement.querySelectorAll(`.dds__tr`);
    if (tableRows.length > pageSize) {
        for (let intI = pageSize; intI < tableRows.length; intI++) {
        tableRows[intI].remove();
        }
    }
  }

  handleRowClick(e: any) {
    const dataIndex = e.target.closest(`.dds__tr`).getAttribute(`data-index`);
    debug({
        iAm: `handleRowClick`,
        msg: `Clicked on ${e.target} in row: ${dataIndex}`
    });
  }
}
