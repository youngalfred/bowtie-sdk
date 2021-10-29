import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})

export class HttpService {
    private headers = {
        "Content-Type": "application/json",
    };

    // Uncomment during local development or else you'll get 404
    // private urlBase = "http://localhost:3001";
    private urlBase = "";

    constructor(private http: HttpClient) { }

    makeHeaders(customHeaders: Record<string, string | string[]>) {
        const combinedHeaders = {
            ...this.headers,
            ...customHeaders
        };

        return Object.entries(combinedHeaders).reduce((http, [key, value]: [string, string | string[]]) => {
            http.set(key, value);
            return http;
        }, new HttpHeaders());
    }

    submit(data: Object, customHeaders: Record<string, string | string[]>): Observable<any> {
        const body = { data };
        const headers = this.makeHeaders(customHeaders);

        return this.http.post(`${this.urlBase}/portfolio/submit?integration=${customHeaders["x-integration-token"]}`, body, {
            headers
        });
    }

    getPortfolioStatus(portfolioId: string, integrationToken: string) {
        return this.http.get(`${this.urlBase}/portfolio/status?integration=${integrationToken}&id=${portfolioId}`)
    }

    getPortfolio(portfolioId: string, integrationToken: string) {
        return this.http.get(`${this.urlBase}/portfolio/${portfolioId}?integration=${integrationToken}`)
    }
}