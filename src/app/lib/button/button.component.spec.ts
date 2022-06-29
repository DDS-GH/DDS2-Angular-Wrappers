import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent } from './button.component';
const c: any = {
    name: `Button`
}
describe(`${c.name}Component`, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ButtonComponent
      ],
    }).compileComponents();
  });

  it(`should create ${c.name}`, () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});

