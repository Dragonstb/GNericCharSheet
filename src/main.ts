import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config.js';
import { GNericMainComponent } from './app/app.component.js';

bootstrapApplication(GNericMainComponent, appConfig)
  .catch((err) => console.error(err));
