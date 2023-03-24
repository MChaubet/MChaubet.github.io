import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[jhiAnimation]',
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.3;
  @Input() intersectionRootMargin = '0px';
  @Input() intersectionRoot?: HTMLElement;

  private intersectionObserver?: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    // this.intersectionObserver = new IntersectionObserver(
    //   entries => {
    //     entries.forEach(entry => {
    //       if (entry.isIntersecting) {
    //         this.element.nativeElement.addEventListener('wheel', this.scrollOnIntersect1(), {
    //           capture: entry.isIntersecting
    //         }, true);
    //       } else {
    //         // this.element.nativeElement.removeEventListener('wheel', this.scrollOnIntersect());
    //       }
    //
    //
    //     });
    //   },
    //   {
    //     threshold: 1,
    //     root: this.intersectionRoot,
    //     rootMargin: this.intersectionRootMargin,
    //   }
    // );
    // this.intersectionObserver.observe(this.element.nativeElement);

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        function scrollOnIntersect(nativeElement: any) {
          return (event: any) => {
            const delta = event.deltaY;

            if (delta > 0) {
              const max = nativeElement.scrollWidth - nativeElement.clientWidth - 1;
              if (nativeElement.scrollLeft === max) {
                console.log('no scroll droit', delta);
                nativeElement.scrollDown += delta;
              } else {
                console.log('scroll droit', delta);
                nativeElement.scrollLeft += delta;
                event.preventDefault();
              }
            }

            if (delta < 0) {
              console.log('scroll droit', delta);
              if (nativeElement.scrollLeft === 0) {
                nativeElement.scrollDown += delta;
              } else {
                nativeElement.scrollLeft += delta;
                event.preventDefault();
              }
            }
          };
        }

        entries.forEach(entry => {
          console.log('entry', entry.isIntersecting);

          if (entry.isIntersecting) {
            // @ts-ignore
            document.querySelector('jhi-main').addEventListener('wheel', e => e.preventDefault());

            this.element.nativeElement.addEventListener('wheel', scrollOnIntersect(this.element.nativeElement), true);
            console.log('if');
          } else {
            this.element.nativeElement.removeEventListener('wheel', scrollOnIntersect(this.element.nativeElement), true);
            console.log('else');
          }
        });
      },
      {
        threshold: 1,
        root: this.intersectionRoot,
        rootMargin: this.intersectionRootMargin,
      }
    );
    this.intersectionObserver.observe(this.element.nativeElement);
  }

  private scrollOnIntersect1() {
    return (event: any) => {
      const delta = event.deltaY;

      const oldValue = this.element.nativeElement.scrollLeft;
      this.element.nativeElement.scrollLeft += delta;
      if (oldValue !== this.element.nativeElement.scrollLeft) {
        event.preventDefault();
      }
    };
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  widthAtMin(element: ElementRef): boolean {
    return element.nativeElement.scrollLeft === 0;
  }

  widthAtMax(element: ElementRef): boolean {
    const max = element.nativeElement.scrollWidth - element.nativeElement.clientWidth - 1;
    return element.nativeElement.scrollLeft === max;
  }
}
