import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Restoration1 from '../../assets/restoration1.jpg';
import Restoration2 from '../../assets/restoration2.jpg';
import Restoration3 from '../../assets/restoration3.jpg';
import Restoration4 from '../../assets/restoration4.jpg';
import Restoration5 from '../../assets/restoration5.jpg';
import Restoration6 from '../../assets/restoration6.jpg';
import Restoration7 from '../../assets/restoration7.jpg';
import Restoration8 from '../../assets/restoration8.jpg';
import Restoration9 from '../../assets/restoration9.jpg';
import Restoration10 from '../../assets/restoration10.jpg';


import 'swiper/css/bundle';

const LatestWork: React.FC = () => {
  // Array of image sources
  const images = [Restoration1, Restoration2, Restoration3, Restoration4, Restoration5, Restoration6, Restoration7, Restoration8, Restoration9, Restoration10];

  // Determine the number of slides to show based on screen size
  const slidesPerViewMobile = 3;
  const slidesPerViewDesktop = 6.5;

  return (
    <>
      <div className="lg:w-screen pt-12 bg-dark-blue">
        <div className="max-w-[1420px] mx-auto flex flex-col items-center justify-center mb-10">
          <h2 className="lg:text-6xl text-5xl px-4 lg:px-0 text-center font-black text-white mb-2">Our Latest Work</h2>
          <p className="text-2xl text-white font-bold">Look at real-life effects</p>
        </div>
        
        <Swiper
      spaceBetween={35}
      slidesPerView={6.5}
      centeredSlides={true}
      loop={true}
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      breakpoints= {{
      // when window width is >= 320px
      320: {
      slidesPerView: 2,
      spaceBetween: 15,
      },
      // when window width is >= 480px
      480: {
      slidesPerView: 3,
      spaceBetween: 15,
      },
      // when window width is >= 640px
      640: {
      slidesPerView: 6,
      spaceBetween: 15,
      }}}
    >
      {/* Map through the images array */}
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={`Headlight Restoration Effect ${index}`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
      </div>
    </>
  );
};

export default LatestWork;
