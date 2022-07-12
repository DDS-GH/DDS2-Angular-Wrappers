import { Component } from "@angular/core";

@Component({
  templateUrl: "./progress.page.html"
})
export class ProgressPageComponent {
    public mySteps = [
        {
          name: 'Meow Meow',
          state: 'complete',
          summary: 'Mrrrr meow',
          link: 'http://www.example.com/',
        },
        {
          name: 'sandpaper tongue',
          state: 'complete',
          summary: 'Mrrrr meow',
          link: 'http://www.example.com/',
        },
        {
          name: 'meow miao',
          state: 'in-progress',
          summary: 'Mrrrr meow',
        },
        {
          name: 'Laser mice',
          state: 'inactive',
          summary: 'Mrrrr meow',
        },
        {
          name: 'rubbing belly',
          state: 'active',
          summary: 'Mrrrr meow',
          link: 'http://www.example.com/',
        },
      ];
}
