import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
logoUrl?: string;
  logoname: string = 'logo2.png';

  ngOnInit(): void {
  this.logoUrl = `${environment.apiBaseUrl}/sanphams/images/${this.logoname}`;
  }
}
