# Using DDS 2.0 in and Angular (12) application

Via NPM:

1. Go to the https://www.delldesignsystem.com/getting-started/vanilla/ and run the npm install command.
2. Add DDS styles to your application. See `src/styles.scss` file.
3. Create a definition file and declare the DDS module. See `src/index.d.ts` file.
4. Copy the html part of one of the DDS into your application. See `src/app.component.html` file. You can get the code to all components of DDS in the [Vanilla Storybook](https://vanilla.delldesignsystem.com/) (Make sure that the version of the Storybook is the same as you have installed).
5. Import the DDS component. See `src/app.component.ts` file.
6. If the component need JS initialization, make sure to initialize it on **ngAfterViewInit**. See `src/app.component.ts` file.
