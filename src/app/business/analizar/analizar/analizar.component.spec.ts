import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizarComponent } from './analizar.component';

describe('AnalizarComponent', () => {
  let component: AnalizarComponent;
  let fixture: ComponentFixture<AnalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
