import { Injectable } from '@angular/core';
import { ModelService } from './model.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Options } from '../modals/options';
import { HttpClient } from '@angular/common/http';
import { Config } from '../modals/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configObject$ = new BehaviorSubject<Config | null>(null);
  configObject = this.configObject$.asObservable();

  private towHitchSelected$ = new BehaviorSubject<boolean>(false);
  towHitchSelected = this.towHitchSelected$.asObservable();

  private yokeSelected$ = new BehaviorSubject<boolean>(false);
  yokeSelected = this.yokeSelected$.asObservable();

  constructor(readonly httpClient: HttpClient) {
  }

  /**
   * 
   * @param id{string} model code
   * @returns Observable<Options>
   */
  getConfigData(id: string): Observable<Options> {
    const url = `/options/${id}`;
    return this.httpClient.get<Options>(url);
  }

  /**
   * Set config data selected by user
   * @param configData {Config}
   */
  setConfigObject(configData: Config | null): void {
    this.configObject$.next(configData);
  }
  /**
   * Set the towHitch selection
   * @param towHitchSelection {boolean}
   */
  setTowHitchSelection(towHitchSelection: boolean) {
    this.towHitchSelected$.next(towHitchSelection);
  }

  /**
   * set yoke selection by user
   * @param yokeSelection {boolean}
   */
  setYokeSelection(yokeSelection: boolean) {
    this.yokeSelected$.next(yokeSelection);
  }

  /**
   * reset configuration once user back on model selection page
   */
  resetConfigSelection(): void {
    this.setConfigObject(null);
  }
}
