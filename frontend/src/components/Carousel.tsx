import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      image: '/slide3.jpg',
      title: 'Salles de réunion modernes',
      description: 'Des espaces de travail équipés pour la productivité'
    },
    {
      id: 2,
      image: '/slide2.jpg',
      title: 'Salles de conférence professionnelles',
      description: 'Idéales pour vos événements et réunions importantes'
    },
    {
      id: 3,
      image: '/slide1.jpg',
      title: 'Espaces collaboratifs flexibles',
      description: 'Adaptez l\'espace selon vos besoins spécifiques'
    }
  ];

  return (
    <section className="relative h-[600px] overflow-hidden">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              /> 
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl mb-8">{slide.description}</p>
                  <a
                    href="/salles"
                    className="rounded-xl btn-primary text-lg px-8 py-3 inline-block btn-outline text-sm px-4 py-2 border-1 bg-red-600 border-red-600 text-white"
                  >
                    Découvrir nos salles
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;