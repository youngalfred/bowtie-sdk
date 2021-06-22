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

        // During local development, prepend "http://localhost:3001" to the url
        return this.http.post("/portfolio/submit", body, {
            headers
        });
    }
}