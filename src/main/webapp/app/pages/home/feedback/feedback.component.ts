import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // @ts-ignore
    new Swiper('.swiper-container.swiper-feedback', {
      effect: 'cards',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination.swiper-feedback',
        clickable: true,
      },
      loop: true,
      cardsEffect: {
        slideShadows: false,
        transformOrigin: 'center',
        depth: 200,
        rotate: true,
        stretch: 0,
        modifier: 1,
      },
    });
  }
}
