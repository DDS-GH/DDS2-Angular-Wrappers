# Using DDS 2.0 in and Angular (12) application

Via NPM:

1. Go to the https://www.delldesignsystem.com/getting-started/vanilla/ and run the npm install command.
2. Add DDS styles to your application. See `src/styles.scss` file.
3. Create a definition file and declare the DDS module. See `index.d.ts` file.
4. NOTE: If you wanted to use the DDS files sourced from the CDN, that pattern exists in this repository as well; you would not need the @dds/components package in your `package.json`, and you would uncomment the links found in `index.html`.  Finally, see the CDN/node module comments within `dds.component.ts`