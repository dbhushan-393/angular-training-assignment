import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelService } from '../../services/model.service';
import { Model } from '../../modals/model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Color } from '../../modals/color';
import { ConfigService } from '../../services/config.service';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-tesla-model-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './tesla-model-selector.component.html',
  styleUrl: './tesla-model-selector.component.scss'
})
export class TeslaModelSelectorComponent {
  modelSelectorForm: FormGroup;
  modelCodeValue: string = "";
  modalData: Model[] = [];
  colorData: Color[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(private readonly modelService: ModelService,
    private readonly configService: ConfigService,
    private readonly fb: FormBuilder
  ) {
    // initialise model selector form
    this.modelSelectorForm = this.fb.group({
      modelCode: [''],
      modelColor: [''],
    });
  }

  ngOnInit() {

    // get the model response from msw
    this.modelService.getModelResponse().pipe(
      takeUntil(this.unsubscribe$))
      .subscribe((modelResponse) => {
        this.modalData = modelResponse;
      });

    // retain the color code selection for the session
    this.modelService.carColorCode.pipe
      ((takeUntil(this.unsubscribe$))).subscribe((colorCode => {
        if (colorCode) {
          this.modelSelectorForm.controls['modelColor'].patchValue(colorCode);
        }
      }))

    // retain the model selection for the session
    this.modelService.modelObject.pipe
      ((takeUntil(this.unsubscribe$))).subscribe((modelObject => {
        if (modelObject) {
          this.colorData = modelObject.colors;
          this.modelSelectorForm.controls['modelCode'].patchValue(modelObject.code);
        }
      }))
  }

  //function to call on model selection
  onModalSelection(): void {
    const modelCodeSelected: string = this.modelSelectorForm?.controls?.['modelCode']?.value;
    // Get the model object
    const modelSelected = this.modalData.find(
      (modal) => modal.code === modelCodeSelected
    );
    if (modelSelected) {
      this.modelService.setModelObject(modelSelected);
      this.colorData = modelSelected.colors;
      this.modelService.setCarModelCode(modelCodeSelected);
    }
    this.modelSelectorForm?.controls['modelColor'].patchValue(this.colorData[0].code);
    // patch the color selection based on model selection
    this.modelService.setCarColorCode(this.colorData[0].code);
    this.modelService.setColorObject(this.colorData[0]);
    // reset the config data based on re selection of model
    this.configService.setConfigObject(null);
    this.configService.setTowHitchSelection(false);
    this.configService.setYokeSelection(false);
  }

  // Event to be called on color selection
  onColorCodeSelection(): void {
    const colorCode = this.modelSelectorForm.controls['modelColor'].value;
    this.modelService.setCarColorCode(colorCode);
    const colorObject = this.colorData.find
      ((colorObject => colorObject.code === colorCode));
    if (colorObject) {
      this.modelService.setColorObject(colorObject);
    }
    // reset the config data based on re selection of model
    this.configService.setConfigObject(null);
    this.configService.setTowHitchSelection(false);
    this.configService.setYokeSelection(false);
  }

  // destroy the subscriptions
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
