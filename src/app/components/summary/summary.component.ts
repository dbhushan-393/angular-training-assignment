import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ModelService } from '../../services/model.service';
import { Config } from '../../modals/config';
import { Color } from '../../modals/color';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { Model } from '../../modals/model';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  readonly ADDITIONAL_COST = 1000;
  towHitch$!: Observable<boolean>;
  yoke$!: Observable<boolean>;
  modelSelected$!: Observable<Model | null>;
  configSelected$!: Observable<Config | null>;
  colorSelected$!: Observable<Color | null>;
  totalCost$!: Observable<number>;
  constructor(
    private readonly modelService: ModelService,
    private readonly configService: ConfigService,
  ) {

  }
  ngOnInit() {
    // get towhitch Observable
    this.towHitch$ = this.configService.towHitchSelected;
    //get yoke Observable
    this.yoke$ = this.configService.yokeSelected;
    // get selected model Observable
    this.modelSelected$ = this.modelService.modelObject;
    // get selected config Observable
    this.configSelected$ = this.configService.configObject;
    // get selected color Observable
    this.colorSelected$ = this.modelService.colorObject;

    // determine total cost as Observable
    this.totalCost$ = combineLatest([this.colorSelected$, this.configSelected$, this.towHitch$, this.yoke$]).pipe(
      map(([colorObject, configObject, towHitchSelected, yokeSelected]) => {
        let totalPrice = 0;
        if (colorObject) {
          totalPrice = colorObject.price;
        }
        if (configObject) {
          totalPrice = totalPrice + configObject.price;
        }
        // if towHitch selected add optional price
        if (towHitchSelected) {
          totalPrice = totalPrice + this.ADDITIONAL_COST;
        }
        // if yokeSelected selected add optional price
        if (yokeSelected) {
          totalPrice = totalPrice + this.ADDITIONAL_COST;
        }
        return totalPrice;
      })
    )
  }
}
