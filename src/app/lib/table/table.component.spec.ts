import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent } from './table.component';
const c: any = {
    name: `Table`
}
describe(`${c.name}Component`, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        TableComponent
      ],
}).compileComponents();
  });

  it(`should create ${c.name}`, () => {
    const fixture = TestBed.createComponent(TableComponent);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });

});

