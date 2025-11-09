import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side',
  imports: [RouterLink, CommonModule],
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent {

  openSection: string | null = null;

  toggleSection(section: string): void {
    this.openSection = this.openSection === section ? null : section;
  }
}
