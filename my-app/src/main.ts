import './polyfills.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare var require: any;
// import 'hammerjs';

if (environment.production) {
  enableProdMode();
  window.console.log = function (){ };
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
