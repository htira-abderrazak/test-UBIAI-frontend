import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  annotate(text: string, labels :string[] ){
    let params = new HttpParams();
    params = params.append('text', text);
    labels.forEach(label => {
      params = params.append('labels', label);
    });

    return this.http.get<any>(this.API_URL+'/annotate/', { params: params });

  }

  exportAsJSON(data: any, filename: string): void {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
