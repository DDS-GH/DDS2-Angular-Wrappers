import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { Uuid } from 'src/app/lib/helpers/dds.helpers';
import {
  injectComponent,
  InjectorCallback,
} from 'src/app/lib/helpers/dds.injector';
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
  //   @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
  //   public mb = {
  //     title: `Error`,
  //     dismissible: true,
  //     layout: `global`,
  //     icon: `alert-info-cir`,
  //     variant: `error`,
  //     body: `No data is available to display.`
  //   };
  //   public classList: string = ``;
  //   public sorting: string = `descending`;
  //   public config: any = {
  //     columns: [
  //       {
  //         value: `Khakis`,
  //         sortBy: this.sorting
  //       },
  //       {
  //         value: `Cornish <tthold id="ht${Uuid()}" title="Tooltip Title">Tooltip Content</tthold>`
  //       },
  //       {
  //         value: `Peking`
  //       }
  //     ],
  //     data: [
  //       [
  //         { value: `Cluck<span class="dds__d-none rowId">${Uuid()}</span>` },
  //         { value: `Cluck` },
  //         { value: `Cluck` }
  //       ],
  //       [
  //         { value: `Bock<span class="dds__d-none rowId">${Uuid()}</span>` },
  //         { value: `Bock` },
  //         { value: `Bock` }
  //       ],
  //       [
  //         { value: `Quack<span class="dds__d-none rowId">${Uuid()}</span>` },
  //         { value: `Quack` },
  //         { value: `Quack` }
  //       ]
  //     ]
  //   };
  //   private emptyRow: Array<any> = [{ value: `` }, { value: `` }, { value: `` }];
  //   private tooltip: any = {};
  //   public selectedIndex?: string = undefined;

  //   constructor(
  //     private viewContainerRef: ViewContainerRef,
  //     private applicationRef: ApplicationRef,
  //     private factoryResolver: ComponentFactoryResolver,
  //     private injector: Injector,
  //     private messageBarState: MessageBarService,
  //   ) {}

  //   ngAfterViewInit(): void {
  //     this.initializeTooltips();
  //   }

  //   handleAdd(e: any) {
  //     if(this.config.data[0] === this.emptyRow) {
  //         this.messageBarState.changeState(toBarState.closed);
  //         this.config.data.pop();
  //     }
  //     const num: number = Uuid();
  //     const buttonData: any = {
  //       id: `trbutton${num}`,
  //       content: `Squeak`
  //     };
  //     const ttData: any = {
  //       id: `tt${num}`,
  //       title: `Cock-a-Doodle-doo`,
  //       content: `I used to run a dating service for chickens, but I was struggling to make hens meet.`
  //     };
  //     this.config.data.push([
  //       { value: `Quack ${num}<span class="dds__d-none rowId">${num}</span>` },
  //       {
  //         value: `Moo? <buttonhold id="${ttData.id}">${buttonData.content}</buttonhold>`
  //       },
  //       {
  //         value: `Joke? <tthold id="${ttData.id}" title="${ttData.title}">${ttData.content}</tthold>`
  //       }
  //     ]);
  //     this.reinitializeTable();
  //   }

  //   handleDelete(e: any) {
  //     this.config.data.pop();
  //     if (this.config.data.length === 0) {
  //         this.messageBarState.changeState(toBarState.open);
  //         this.config.data.push(this.emptyRow);
  //     }
  //     this.reinitializeTable();
  //   }

  //   reinitializeTable() {
  //     // @ts-ignore
  //     this.myTable.ddsElement.innerHTML = ``;
  //     // @ts-ignore
  //     this.myTable.ddsComponent.dispose();
  //     // @ts-ignore
  //     this.myTable.initializeNow();
  //     this.initializeButtons();
  //     this.initializeTooltips();
  //   }

  //   handleSelect(e: any) {
  //     // @ts-ignore
  //     const tableRows = this.myTable.ddsElement.querySelectorAll(`.dds__tr`);
  //     const randIndx = randomNumber(0, tableRows.length);
  //     const selectedRow = tableRows[randIndx];

  //     // remove classes indicating selection
  //     // @ts-ignore
  //     this.myTable.ddsElement
  //       .querySelectorAll(`.selectedRow`)
  //       .forEach((r: any) => {
  //         r.classList.remove(`selectedRow`);
  //       });

  //     // select new random row, store its hidden ID at root
  //     if (selectedRow.querySelector(`.rowId`)) {
  //       this.selectedIndex = selectedRow.querySelector(`.rowId`).innerText;
  //     }

  //     // add selection classes
  //     selectedRow.querySelectorAll(`.dds__td`).forEach((c: any) => {
  //       c.classList.add(`selectedRow`);
  //     });
  //   }

  //   handleSort(e: any) {
  //     if (typeof e.detail === `number`) {
  //       switch (this.sorting) {
  //         case `descending`:
  //           this.sorting = `ascending`;
  //           break;
  //         case `ascending`:
  //           this.sorting = `unsorted`;
  //           break;
  //         case `unsorted`:
  //           this.sorting = `descending`;
  //           break;
  //       }
  //       // @ts-ignore
  //       this.myTable.ddsComponent.sort(0, this.sorting);
  //     } else {
  //       this.sorting = e.sortBy;
  //     }
  //     this.initializeTooltips();
  //   }

  //   handleSticky(e: any) {
  //     if (this.classList.indexOf(`sticky`) > 0) {
  //       this.classList = ``;
  //     } else {
  //       this.classList = `dds__table--sticky-header custom-height`;
  //     }
  //   }

  //   initializeButtons() {
  //     const element = this.viewContainerRef.element.nativeElement as HTMLElement;
  //     const callback:InjectorCallback = {
  //         event: `click`,
  //         method: this.handleRowButtonClick,
  //     }
  //     injectComponent(
  //       this.applicationRef,
  //       this.factoryResolver,
  //       this.injector,
  //       ButtonComponent,
  //       element.querySelectorAll('buttonhold'),
  //       `dds__button--mini dds__button--destructive`,
  //       callback,
  //     );
  //   }

  //   initializeTooltips() {
  //     const element = this.viewContainerRef.element.nativeElement as HTMLElement;
  //     console.log(element.querySelectorAll('tthold'));
  //     injectComponent(
  //       this.applicationRef,
  //       this.factoryResolver,
  //       this.injector,
  //       TooltipComponent,
  //       element.querySelectorAll('tthold')
  //     );
  //   }

  //   handleRowButtonClick(e: any) {
  //     debug(e.target);
  //   }
  // }
  @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
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
  private emptyRow: Array<any> = [{ value: `` }, { value: `` }, { value: `` }];
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
    private injector: Injector,
    private messageBarState: MessageBarService
  ) {}

  ngAfterViewInit(): void {
    this.handleAdd(5);
    this.initializeTooltips();
    const linkPool = (e: any) => {
      this.pool.page.current = e.detail.currentPage - 1;
      this.pool.page.size = e.detail.pageSize;
      this.reinitializeTable();
    };
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
          value: `Joke? <tthold id="${ttData.id}" title="${ttData.title}">${ttData.content}</tthold>`,
        },
      ]);
    }
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

  handleDelete(e: any) {
    this.pool.data.pop();
    if (this.pool.data.length === 0) {
      this.messageBarState.changeState(toBarState.open);
      this.pool.data.push(this.emptyRow);
    }
    this.reinitializeTable();
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
    return this.pool.data;
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
