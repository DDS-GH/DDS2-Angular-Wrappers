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
  public sorting: string = `descending`;
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
        sortBy: this.sorting,
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
    // @ts-ignore
    this.paginationRef.ddsElement.addEventListener(
      `ddsPaginationPageChangedEvent`,
      linkPool
    );
    // @ts-ignore
    this.paginationRef.ddsElement.addEventListener(
      `ddsPaginationPageSizeChangedEvent`,
      linkPool
    );
  }

  handleAdd(e: number = 1) {
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
    const length = this.pool.data.length;
    const size = this.pool.page.size;
    const page = this.pool.page.current;
    let localSize = size;
    if (length === 0) {
      return [];
    }
    if (length < page * size) {
      localSize = length;
    } else if (length < page * size + size) {
      localSize = length;
    }
    return this.pool.data.slice(page * size, page * size + localSize);
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
