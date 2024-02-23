import { Injectable, inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from "@angular/router";
import { ConfigService } from "./config.service";
import { ModelService } from "./model.service";
import { Routes } from "../enums/routes.enum";

@Injectable({
    providedIn: 'root'
})
export class StepGuardService {

    constructor(private readonly configService: ConfigService,
        private readonly modelService: ModelService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (state.url.includes(Routes.CONFIG)) {
            return !!this.modelService.carModelCode$.value;
        }
        if (state.url.includes(Routes.SUMMARY)) {
            return !!this.configService.configObject$.value;
        }
        return false;
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(StepGuardService).canActivate(next, state);
}