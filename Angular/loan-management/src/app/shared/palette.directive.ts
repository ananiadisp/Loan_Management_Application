import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { PaletteUtil } from './palette.util';

@Directive({
  selector: '[appPalette]',
  standalone: true,
})
export class PaletteDirective implements OnInit {
  @Input('appPalette') paletteKey: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const color = PaletteUtil.pickColor(this.paletteKey);
    this.el.nativeElement.style.color = color;
  }
}
