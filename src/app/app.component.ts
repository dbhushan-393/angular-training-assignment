import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { TeslaModelDisplayComponent } from './components/tesla-model-display/tesla-model-display.component';
import { ModelService } from './services/model.service';
import { ConfigService } from './services/config.service';
import { Observable, map, of } from 'rxjs';
import { Routes } from './enums/routes.enum';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeslaModelDisplayComponent,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly routes = [
    '/model-selection',
    '/config-selection',
    '/summary',
  ];

  constructor(private readonly modelService: ModelService,
    private readonly configService: ConfigService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.router.navigate([""]);
  }
  /**
   * Disable the route based on selection of user
   * @param route route of the steps
   * @returns Observable<boolean>
   */
  shouldRouteBeDisable(route: string): Observable<boolean> {
    switch (route) {
     case Routes.CONFIG:
      // if model code is not selected
        return this.modelService.carModelCode.pipe((
          map((carModelCode => !carModelCode))));
      case Routes.SUMMARY:
        // if config is not selected
        return this.configService.configObject.pipe((
          map((configObject => !configObject))));
      default:
        return of(false);
    }
  }
}
