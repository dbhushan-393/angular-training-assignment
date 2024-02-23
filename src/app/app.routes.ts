import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { StepGuardService } from './services/step-guard.service';
import { TeslaModelSelectorComponent } from './components/tesla-model-selector/tesla-model-selector.component';
import { TeslaConfigurationSelectorComponent } from './components/tesla-configuration-selector/tesla-configuration-selector.component';


export const routes: Routes = [
  { path: '', redirectTo: 'model-selection', pathMatch: 'full' },
  { path: 'model-selection', component: TeslaModelSelectorComponent },
  {
    path: 'config-selection',
    component: TeslaConfigurationSelectorComponent,
    canActivate: [StepGuardService]
  },
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [StepGuardService]
  },
];
