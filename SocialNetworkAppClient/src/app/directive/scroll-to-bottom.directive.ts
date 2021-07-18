import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scroll-to-bottom]'
})
export class ScrollToBottomDirective {
  constructor(private _el: ElementRef) { }

  // public ngAfterViewInit() {
  //   const el: HTMLDivElement = this._el.nativeElement;
  //   // Does not work as scrollHeight === offsetHeight
  //   el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  //   // This work but we see scroll moving
  //   setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight));
  // }

  // public ngOnInit() {
  //   const el: HTMLDivElement = this._el.nativeElement;
  //   // Does not work as scrollHeight === offsetHeight
  //   el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  //   // This work but we see scroll moving
  //   setTimeout(() => el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight));
  // }

  public scrollToBottom() {
    const el: HTMLDivElement = this._el.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }
}