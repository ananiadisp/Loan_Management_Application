import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  imports: [CommonModule],
})
export class CustomerDetailsComponent {
  @Input() customer: any;
}
