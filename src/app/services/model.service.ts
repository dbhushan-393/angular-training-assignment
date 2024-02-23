import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Model } from '../modals/model';
import { Color } from '../modals/color';

@Injectable({
  providedIn: 'root'
})
export class ModelService {


  private carColorCode$ = new BehaviorSubject<string>('');
  carColorCode = this.carColorCode$.asObservable();

  carModelCode$ = new BehaviorSubject<string>('');
  carModelCode = this.carModelCode$.asObservable();

  private modelObject$ = new BehaviorSubject<Model | null>(null);
  modelObject = this.modelObject$.asObservable();

  private colorObject$ = new BehaviorSubject<Color | null>(null);
  colorObject = this.colorObject$.asObservable();

  constructor(private readonly httpClient: HttpClient) {
  }

  /**
   * Get the model response from MSW
   * @returns Observable<Model>
   */
  getModelResponse(): Observable<Model[]> {
    return this.httpClient.get<Model[]>('/models');
  }

  /**
   * Set the model Object
   * @param modelData 
   */
  setModelObject(modelData: Model | null): void {
    this.modelObject$.next(modelData);
  }

  /**
   * Set the color code 
   * @param data colorCode
   */
  setCarColorCode(colorCode: string): void {
    this.carColorCode$.next(colorCode);
  }

  /**
   * set the model code
   * @param modelCode 
   */
  setCarModelCode(modelCode: string): void {
    this.carModelCode$.next(modelCode);
  }

  /**
   * set the color object
   * @param colorObject 
   */
  setColorObject(colorObject: Color | null): void {
    this.colorObject$.next(colorObject);
  }

  /**
   * Reset the model selection once get back to main page
   */
  resetModelSelection() {
    this.setCarColorCode('');
    this.setCarModelCode('');
    this.setColorObject(null);
    this.setModelObject(null);
  }
}