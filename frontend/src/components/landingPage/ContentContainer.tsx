import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Restoration1 from "../../assets/restoration1.jpg";
import Restoration2 from "../../assets/restoration2.jpg";
import Restoration3 from "../../assets/restoration3.jpg";
import Restoration4 from "../../assets/restoration4.jpg";
import Restoration5 from "../../assets/restoration5.jpg";
import Restoration6 from "../../assets/restoration6.jpg";
import Restoration7 from "../../assets/restoration7.jpg";
import Restoration8 from "../../assets/restoration8.jpg";
import Restoration9 from "../../assets/restoration9.jpg";
import Restoration10 from "../../assets/restoration10.jpg";

import "swiper/css/bundle";
import "swiper/css";
import { useAuth } from "../../contexts/authContext";

interface Props {
  // Define props here
}

const ContentContainer: React.FC<Props> = (props) => {
  const images = [
    Restoration1,
    Restoration2,
    Restoration3,
    Restoration4,
    Restoration5,
    Restoration6,
    Restoration7,
    Restoration8,
    Restoration9,
    Restoration10,
  ];

  // Determine the number of slides to show based on screen size
  const slidesPerViewMobile = 3;
  const slidesPerViewDesktop = 6.5;
  const { user } = useAuth();

  return (
    <>
      {/* Main container */}
      <div className="flex w-full">
        <div className="flex flex-col gap-8 w-full">
          {/* Content Bar */}
          <div className="bg-dark-blue flex lg:px-20 py-8 flex-col gap-8 px-8">
            <div className="flex flex-1 flex-col justify-center items-center text-white text-center">
              <h1 className="font-black text-5xl">Increase your car</h1>
              <h2 className="font-bold text-2xl text-blue">
                Value, Safety and Appearance
              </h2>
              <p className="text-lg lg:text-center mb-2 mt-4 w-full lg:w-2/3">
                Restores clarity to headlights that have become foggy,
                discolored, or yellowed due to sun damage and continuous
                exposure to environmental factors. This service typically takes
                less than an hour to complete.
              </p>
              <div className="flex gap-4 mt-2 flex-wrap">
                <a
                  href="tel:+19547663631"
                  className="border-2 border-blue py-2 px-6 rounded-full flex-1 flex-initial w-auto"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/+17542718031"
                  className="border-2 border-blue py-2 px-6 rounded-full flex-1 flex-initial w-auto"
                >
                  WhatsApp
                </a>
                {user ? (
                  <a
                    href="/profile/orderform"
                    className="border-2 border-blue py-2 px-6 rounded-full flex-1 flex-initial w-auto"
                  >
                    Book Appointment
                  </a>
                ) : null}
              </div>
              <div className="lg:w-screen bg-dark-blue overflow-hidden">
                <Swiper
                  autoplay={true}
                  className="mt-8 w-screen"
                  spaceBetween={35}
                  slidesPerView={6.5}
                  centeredSlides={true}
                  loop={true}
                  pagination={{ clickable: true }}
                  breakpoints={{
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
                    },
                  }}
                >
                  {/* Map through the images array */}
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={src}
                        alt={`Headlight Restoration Effect ${index}`}
                        className={"object-cover w-full lg:min-h-60 rounded-xl"}
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentContainer;
