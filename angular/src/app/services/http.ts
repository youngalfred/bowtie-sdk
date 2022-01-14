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

        return new HttpHeaders(combinedHeaders);
    }

    submit(data: Object, customHeaders: Record<string, string | string[]>): Observable<any> {
        const body = { data };
        const headers = this.makeHeaders(customHeaders);

        return this.http.post(`${this.urlBase}/portfolio/submit?integration=${customHeaders["x-integration-token"]}`, body, {
            headers
        });
    }

    getPortfolioStatus(portfolioId: string, customHeaders: Record<string, string | string[]>) {
        const headers = this.makeHeaders(customHeaders);
        return this.http.get(`${this.urlBase}/portfolio/status?id=${portfolioId}`, {
            headers
        })
    }

    getPortfolio(portfolioId: string, customHeaders: Record<string, string | string[]>) {
        const headers = this.makeHeaders(customHeaders);
        return this.http.get(`${this.urlBase}/portfolio/${portfolioId}`, {
            headers
        })
    }

    uploadFiles = async (files: File[], headers: Record<string, string>): Promise<{ fileName: string; objectId: string; }[]> => {
        const results: { fileName: string; objectId: string }[] = [];

        for (let i = 0; i < files.length; i += 1) {
            const formData = new FormData();
            formData.append("file", files[i] as Blob);
            const response = await fetch("/file", {
                method: "POST",
                body: formData,
                headers,
            });
    
            try {
                const { objectId } = await response.json();
                if (response.ok && objectId) {
                    results.push({ fileName: files[i]?.name || "", objectId });
                }
            } catch (error) {
                // Do nothing. Already tracking which files were uploaded successfully.
            }
        }
    
        return results;
    };
}