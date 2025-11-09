import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SideComponent } from '../side/side.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, SideComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
