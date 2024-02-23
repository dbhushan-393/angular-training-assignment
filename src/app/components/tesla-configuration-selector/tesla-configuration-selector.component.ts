import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Options } from '../../modals/options';
import { ConfigService } from '../../services/config.service';
import { ModelService } from '../../services/model.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Config } from '../../modals/config';
@Component({
  selector: 'app-config-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './tesla-configuration-selector.component.html',
  styleUrl: './tesla-configuration-selector.component.scss'
})
export class TeslaConfigurationSelectorComponent {
  modelCode!: string;
  configForm: FormGroup;
  configData!: Options;
  selectConfiguration!: Config | undefined;
  unsubscribe$ = new Subject<void>();

  constructor(
    readonly configService: ConfigService,
    readonly modelService: ModelService,
    readonly fb: FormBuilder

  ) {
    // config form initialisation
    this.configForm = this.fb.group({
      config: [''],
      twitch: [false],
      yoke: [false],
    });
    this.modelService.carModelCode.pipe(takeUntil(this.unsubscribe$)).subscribe((modelCode) => {
      this.modelCode = modelCode;
    });
  }
  ngOnInit() {
    // get the config data based on model code from MSW
    this.configService.getConfigData(this.modelCode).pipe(takeUntil(this.unsubscribe$)).subscribe((data: Options) => {
      this.configData = data;
    });
    this.configService.configObject.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data) {
        this.selectConfiguration = data;
        this.configForm.controls['config'].patchValue(data.id);
        this.configForm.controls['twitch'].patchValue(data)
      }
    });
    this.configService.yokeSelected.pipe(takeUntil(this.unsubscribe$)).subscribe((data => this.configForm.controls['yoke'].patchValue(data)));
    this.configService.towHitchSelected.pipe(takeUntil(this.unsubscribe$)).subscribe((data => this.configForm.controls['twitch'].patchValue(data)));

  }

  // event to be called on config selection
  onConfigSelection(): void {
    this.selectConfiguration = this.configData.configs.find(
      (config: Config) => config.id === this.configForm.controls['config'].value
    );
    if (this.selectConfiguration) {
      this.configService.setConfigObject(this.selectConfiguration);
    }
    // reset the yoke towHitch selection on selecting config
    this.configService.setTowHitchSelection(false);
    this.configService.setYokeSelection(false);
  }

  /**
   * event to be called on selection of towHitch
   * @param event {MatCheckboxChange}
   */
  towHitchSelection(event: MatCheckboxChange): void {
    this.configService.setTowHitchSelection(event.checked);
  }

  /**
 * event to be called on selection of yoke 
 * @param event {MatCheckboxChange}
 */
  yokeSelection(event: MatCheckboxChange): void {
    this.configService.setYokeSelection(event.checked);
  }

  // destroy the subscriptions
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
