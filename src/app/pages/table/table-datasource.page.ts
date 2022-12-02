import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  templateUrl: './table-datasource.page.html',
  styleUrls: ['./table-datasource.page.scss'],
})
export class TableDataSourcePageComponent {
  @ViewChild(`myTable`) myTable!: ElementRef<HTMLElement>;
  @ViewChild(`myPagination`) myPagination!: ElementRef<HTMLElement>;
  @ViewChild(`loader`) myLoader!: ElementRef<HTMLElement>;

  public tableId: string = `tableInstance`;
  public paginationId: string = `paginationInstance`;
  public loaderHidden: boolean = true; // global always starts hidden even if set to false here
  public classList: string = `dds__table--compact`;
  public sorting: string = `descending`;
  public pool: any = {
    page: {
      size: 4,
      options: [2, 4, 6],
    },
  };
  public tableConfig: any = {
    subscribe: [`paginationId`],
    dataSource: {
      fetchData: this.fetchData,
    },
    columns: [
      { value: 'Name' },
      { value: 'Tags' }, // REMOVE render: renderTags AND FILTERING ACTUALLY WORKS
      { value: 'URL' },
    ],
    pagination: {
      currentPage: 1,
      rowsPerPage: this.pool.page.options[0],
    },
    expandableRows: true,
  };
  public pagingConfig: any = {
    perPageSelected: this.pool.page.size,
    perPageOptions: this.pool.page.options,
    options: {
      subscribe: [`tableId`],
    },
  };

  async fetchData({ currentPage, pageSize, sort }: any) {
    const makeRequest = (options: any) => {
      options = options || {};
      const method = options.method;
      const url = options.url;
      const data = options.data || {};
      const token = options.token || ``;

      if (!method || !url) {
        console.error(`makeRequest configuration error`);
        return;
      }

      const xhr = new XMLHttpRequest();
      return new Promise((resolve) => {
        xhr.open(method, url, true);
        xhr.onload = () =>
          resolve({
            status: xhr.status,
            response: xhr.responseText,
          });
        xhr.onerror = () =>
          resolve({
            status: xhr.status,
            response: xhr.responseText,
          });
        if (method != 'GET') {
          xhr.setRequestHeader(
            'Content-Type',
            'application/json;charset=UTF-8'
          );
        }
        if (token != null) {
          xhr.setRequestHeader('X-Jsio-Token', token);
        }

        if (Object.keys(data).length > 0) {
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send();
        }
      });
    };
    const loader: any = {
      show: () => {
        // @ts-ignore
        // this.loader.ddsComponent.show();
      },
      hide: () => {
        // @ts-ignore
        // self.loader.ddsComponent.hide();
      },
    };

    try {
      loader.show();
      const request: any = await makeRequest({
        method: `GET`,
        url: `https://my-json-server.typicode.com/DDS-DLS/DDS-Table-json/series`,
      });
      let parsed = JSON.parse(request.response);
      let totalCount = parsed.length;
      let fCount;

      //   // get all filters (tags)
      //   parsed.forEach(p => {
      //     p.tags.forEach(pt => {
      //       if (!filters.tags.current.includes(pt)) {
      //         filters.tags.current.push(pt);
      //       }
      //     })
      //   });

      //   // filter server data
      //   if (filters.tags.selected) {
      //     parsed = parsed.filter((elm) => {
      //       return elm.tags.includes(filters.tags.selected);
      //     });
      //     fCount = parsed.length;
      //   }

      // Sort server data
      if (sort && sort.columnId !== undefined && sort.sortBy !== undefined) {
        parsed = parsed.sort(this.mockServerSort(sort));
      }

      // Slice server data
      // If pageSize === 0 that means there is no pagination
      if (pageSize) {
        parsed = parsed.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
      }

      // map data
      const response: any[] = [];
      parsed.forEach((r: any) => {
        response.push({
          expandable: true,
          expandableContent: r.details,
          columns: [
            { value: r.name },
            { value: r.tags.join(`, `) },
            { value: r.url },
            { value: `` },
          ],
        });
      });

      const retObj = {
        data: response,
        totalItems: fCount || totalCount,
      };
      loader.hide();
      return retObj;
    } catch (error) {
      console.warn('fetchData fail', error);
      loader.hide();
      return;
    }
  }

  mockServerSort(sort: any) {
    return (listA: any, listB: any) => {
      const valA = listA[sort.columnId].value;
      const valB = listB[sort.columnId].value;

      if (valA === valB || sort.sortBy === 'unsorted') {
        return 0;
      }

      if (sort.sortBy === 'descending') {
        return valA < valB ? 1 : -1;
      }

      return valA > valB ? 1 : -1;
    };
  }
}
