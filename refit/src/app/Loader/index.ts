import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LoaderInterceptor } from "./loader.interceptor";
import { LoaderService } from "./loader.service";


@NgModule({
    providers: [
        LoaderService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        }
    ]
})

export class LoadingModule {
}

export * from './loader.service';