import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiserviceService, Metadata, PredictionResponse, FeatureSchema as Feature } from '../../../shared/services/apiservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analizar',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './analizar.component.html',
  styleUrl: './analizar.component.css'
})
export class AnalizarComponent implements OnInit {

  predictionForm!: FormGroup;
  metadata!: Metadata;
  isLoading = true;
  predictionResult: PredictionResponse | null = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiserviceService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.apiService.getMetadata().subscribe({
      next: (meta) => {
        this.metadata = meta;
        this.createForm(meta.schema_features);
        this.isLoading = false;

        this.subscribeToFormChanges();
      },
      error: (err) => {
        console.error('Error al cargar metadatos:', err);
        this.errorMessage = 'No se pudieron cargar los metadatos de la API. Verifica que esté funcionando.';
        this.isLoading = false;
      }
    });

    this.createForm([]);
  }

  private subscribeToFormChanges(): void {
    this.predictionForm.valueChanges.subscribe(formValue => {
      console.log('📝 Valores del formulario (en caliente):', formValue);

      // Si quieres ver los valores con los nombres originales (sin sanitizar):
      const originalValues: { [key: string]: any } = {};
      for (const key in formValue) {
        const originalName = key.replace(/_/g, '.');
        originalValues[originalName] = formValue[key];
      }
      console.log('📝 Valores con nombres originales:', originalValues);
    });
  }
  // Modificar los getters
  get numericalFeatures(): any[] {
    return this.metadata?.schema_features
      .filter(f => f.dtype === 'number')
      .map(f => ({
        ...f,
        sanitizedName: f.name.replace(/\./g, '_')
      })) || [];
  }

  get categoricalFeatures(): any[] {
    return this.metadata?.schema_features
      .filter(f => f.dtype === 'string')
      .map(f => ({
        ...f,
        sanitizedName: f.name.replace(/\./g, '_')
      })) || [];
  }

  // Crea el FormGroup dinámicamente a partir del esquema de la API
  private createForm(features: any[]): void {
    const group: { [key: string]: AbstractControl } = {};

    features.forEach(feature => {
      const validators = feature.required ? [Validators.required] : [];
      let initialValue: any = null;

      // Asigna un valor inicial predeterminado para mejor UX
      if (feature.dtype === 'number') {
        initialValue = 0;
        validators.push(Validators.pattern(/^-?\d*\.?\d*$/)); // Patrón para números
      }

      // Usa el primer 'allowed_value' como valor inicial para selectores si existe
      if (feature.allowed_values && feature.allowed_values.length > 0) {
        initialValue = feature.allowed_values[0];
      }

      const sanitizedName = feature.name.replace(/\./g, '_');
      group[sanitizedName] = this.fb.control(initialValue, validators);
    });

    this.predictionForm = this.fb.group(group);
  }

  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.predictionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.predictionResult = null;

    const rawData = this.predictionForm.value;
    const processedData: { [key: string]: any } = {};

    for (const key in rawData) {
      // Reconvertir el nombre al original (con puntos)
      const originalName = key.replace(/_/g, '.');
      const feature = this.metadata.schema_features.find(f => f.name === originalName);

      if (feature && feature.dtype === 'number') {
        processedData[originalName] = Number(rawData[key]);
      } else {
        processedData[originalName] = rawData[key];
      }
    }

    const requestBody = { registro: processedData };

    this.apiService.predict(requestBody).subscribe({
      next: (res) => {
        this.predictionResult = res;
        this.isLoading = false;
        console.log('Predicción recibida:', res);
      },
      error: (err) => {
        console.error('Error en la predicción:', err);
        this.errorMessage = 'Ocurrió un error al realizar la predicción: ' + (err.error?.detail || err.message);
        this.isLoading = false;
      }
    });
  }
}

