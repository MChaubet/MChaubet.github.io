import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // @ts-ignore
    new Swiper('.swiper-container.swiper-news', {
      effect: 'carousel',
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: true,
      grabCursor: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next.swiper-news',
        prevEl: '.swiper-button-prev.swiper-news',
      },
    });
  }
}
