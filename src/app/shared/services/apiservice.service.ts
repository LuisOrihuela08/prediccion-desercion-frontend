import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FeatureSchema {
  name: string;
  dtype: 'number' | 'string';
  required: boolean;
  allowed_values?: string[];
}

export interface Metadata {
  schema_features: FeatureSchema[];
  classes: string[];
}

export interface PredictionResponse {
  prob_deserto: number;
  y_pred: number;
  label: string;
}

export interface PredictRequest {
  registro: {[key: string] : any};
}

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getMetadata(): Observable<Metadata>{
    return this.http.get<Metadata>(`${this.apiUrl}/metadata`);
  }

  predict(data: PredictRequest): Observable<PredictionResponse>{
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict`, data);
  }
}
