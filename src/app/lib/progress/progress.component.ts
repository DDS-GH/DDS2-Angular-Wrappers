import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { setElementId } from '../helpers/dds.helpers';

@Component({
  selector: `dds-progress`,
  templateUrl: `./progress.component.html`,
})
export class ProgressComponent implements OnInit, AfterViewInit {
  @Input() elementId: string = ``;
  @Input() classList: string = ``;
  @Input() steps: any = [
    {
      name: 'Step Name',
      state: 'complete',
      summary: 'Summary text',
      link: 'http://www.example.com/',
    },
    {
      name: 'Step Name',
      state: 'complete',
      summary: 'Summary text',
      link: 'http://www.example.com/',
    },
    {
      name: 'Step Name',
      state: 'in-progress',
      summary: 'Summary text',
    },
    {
      name: 'Step Name',
      state: 'inactive',
      summary: 'Summary text',
    },
    {
      name: 'Step Name',
      state: 'active',
      summary: 'Summary text',
      link: 'http://www.example.com/',
    },
  ];

  ngOnInit() {
    this.elementId = setElementId(this.elementId);
  }

  ngAfterViewInit() {
    // This is a strange hack because the SCSS variable from DDS is not rendered properly
    const rootEl = document.getElementById(this.elementId);
    if (rootEl) {
      // @ts-ignore
      const currentEl: HTMLElement = rootEl.querySelector(`.dds__progress-tracker--in-progress .dds__progress-tracker__icon`);
      // @ts-ignore
      const parentEl: HTMLElement = currentEl.parentElement;
      const parentBox = parentEl?.getBoundingClientRect();
      if (currentEl && currentEl.id !== this.elementId && parentBox) {
        const topStyle = currentEl.getAttribute(`style`);
        if (!topStyle) {
          const border = 2.5/2; // parentEl.style.borderWidth;
          currentEl.style.top = `calc(50% - ${(parentBox.height / 4)+border}px)`;
          parentEl.style.display = `flex`;
          parentEl.style.justifyContent = `center`;
        }
      }
    }
  }
}

