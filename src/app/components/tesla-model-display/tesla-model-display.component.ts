import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../../services/model.service';
import { Observable, combineLatest, map } from 'rxjs';

const IMAGE_ENDPOINT = 'https://interstate21.com/tesla-app/images';

@Component({
  selector: 'app-tesla-model-display',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tesla-model-display.component.html',
  styleUrl: './tesla-model-display.component.scss'
})

export class TeslaModelDisplayComponent {
  color$!: Observable<String>;
  code$!: Observable<String>;
  imageUrl$!: Observable<String>;
  constructor(readonly modelService: ModelService) { }
  ngOnInit() {
    this.color$ = this.modelService.carColorCode;
    this.code$ = this.modelService.carModelCode;
    // construct the obseravble of image url with color code and model code
    this.imageUrl$ = combineLatest([this.color$, this.code$])
      .pipe(
        map(([color, code]) => `${IMAGE_ENDPOINT}/${code}/${color}.jpg`)
      )
  }
}
