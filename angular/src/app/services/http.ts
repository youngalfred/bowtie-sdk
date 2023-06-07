import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BowtieApiPortfolio, NewBowtieSession } from '@youngalfred/bowtie-sdk'

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private headers = {
    'Content-Type': 'application/json',
  }

  constructor(private http: HttpClient) {}

  makeHeaders(customHeaders: Record<string, string | string[]>) {
    const combinedHeaders = {
      ...this.headers,
      ...customHeaders,
    }

    return new HttpHeaders(combinedHeaders)
  }

  uploadFiles = async (
    files: File[],
    headers: Record<string, string> = {},
  ): Promise<{ fileName: string; objectId: string }[]> => {
    const results: { fileName: string; objectId: string }[] = []

    for (let i = 0; i < files.length; i += 1) {
      const formData = new FormData()
      formData.append('file', files[i] as Blob)
      const response = await fetch('/file', {
        method: 'POST',
        body: formData,
        headers,
      })

      try {
        const { objectId } = await response.json()
        if (response.ok && objectId) {
          results.push({ fileName: files[i]?.name || '', objectId })
        }
      } catch (error) {
        // Do nothing. Already tracking which files were uploaded successfully.
      }
    }

    return results
  }
  
}
