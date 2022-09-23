import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestInterceptor } from "./request-interceptors";

export const interceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
];