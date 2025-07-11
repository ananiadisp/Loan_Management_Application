import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<{
    activeOnly: boolean;
    importantOnly: boolean;
  }>();

  searchTerm: string = '';
  activeOnly: boolean = false;
  importantOnly: boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Set up debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        console.log('Debounced search term:', searchTerm);
        this.searchChange.emit(searchTerm);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange() {
    console.log('Search term changed:', this.searchTerm);
    this.searchSubject.next(this.searchTerm);
  }

  onSearch() {
    console.log('Search button clicked:', this.searchTerm);
    this.searchChange.emit(this.searchTerm);
  }

  onClear() {
    console.log('Clear button clicked');
    this.searchTerm = '';
    this.searchSubject.next('');
  }
}
