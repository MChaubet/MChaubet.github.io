import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DOMTarget = gsap.DOMTarget;

@Component({
  selector: 'jhi-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.initScrollTriggers();
  }

  private initScrollTriggers() {
    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray('section') as any[];

    let maxWidth = 0;
    const getMaxWidth = () => {
      maxWidth = 0;
      sections.forEach((section: any) => {
        maxWidth += section.offsetWidth;
      });
    };
    ScrollTrigger.addEventListener('refreshInit', getMaxWidth);

    gsap.to(sections, {
      x: () => `-${maxWidth - window.innerWidth}`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.wrapper',
        pin: true,
        scrub: true,
        end: () => `+=${maxWidth}`,
        invalidateOnRefresh: true,
      },
    });

    sections.forEach((sct, i) => {
      ScrollTrigger.create({
        trigger: sct as DOMTarget,
        start: () => {
          const value = sct.offsetLeft - window.innerWidth / 2;
          const avgSizeSection = maxWidth / (maxWidth - window.innerWidth);
          return 'top top-=' + value * avgSizeSection;
        },
        end: () => {
          const avgSizeSection = maxWidth / (maxWidth - window.innerWidth);
          return '+=' + sct.offsetWidth * avgSizeSection;
        },
        toggleClass: { targets: sct, className: 'active' },
      });
    });
  }
}
