import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

@Component({
  selector: 'jhi-our-scroll',
  templateUrl: './our-scroll.component.html',
  styleUrls: ['./our-scroll.component.scss'],
})
export class OurScrollComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
    this.initScrollTriggers();
  }

  initScrollTriggers() {
    const sections = gsap.utils.toArray('.panel');
    let maxWidth = 0;

    sections.forEach((section: any) => {
      if (sections) {
        maxWidth += section.offsetWidth;
      }
    });
    // maxWidth = maxWidth / sections.length * (sections.length - 1);

    const panels = gsap.utils.toArray('#panels-container .panel');
    console.log(maxWidth);
    console.log(panels.length);
    console.log(maxWidth / panels.length);
    // @ts-ignore
    console.log(panels[0].offsetWidth);
    // gsap.to(panels, {
    //   // @ts-ignore
    //   xPercent: -`${maxWidth}`,
    //   // x: -`${panels[0].offsetWidth * (panels.length-3)}`,
    //   // ease: "none",
    //   scrollTrigger: {
    //     markers: true,
    //     trigger: "#panels-container",
    //     pin: true,
    //     start: "top top",
    //     scrub: 1,
    //     // end: maxWidth
    //   }
    // });
    const panelsContainer = document.querySelector('#panels-container');
    // @ts-ignore
    console.log(panelsContainer?.offsetWidth);
    gsap.to(panels, {
      // @ts-ignore
      xPercent: () => -100 * (panels.length - 1),
      ease: 'none',
      // margin: 10,
      scrollTrigger: {
        trigger: '#panels-container',
        pin: true,
        start: 'top top',
        scrub: 1,
        snap: {
          snapTo: 1 / (panels.length - 1),
          inertia: false,
          duration: { min: 0.1, max: 0.1 },
        },
        // @ts-ignore
        end: () => '+=' + (panelsContainer.offsetWidth - innerWidth),
      },
    });
  }
}
