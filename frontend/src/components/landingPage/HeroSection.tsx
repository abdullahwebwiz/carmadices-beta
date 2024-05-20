import React from 'react';
import Photo1 from '../../assets/restoration4.jpg';
import Photo2 from '../../assets/headlight-2.jpg';
import Photo3 from '../../assets/headlight-3.jpg';
import Trusted1 from '../../assets/sema.jpg';

const HeroSection: React.FC = () => {
  return (
    <>
      {/* Main container */}
      <div className="flex w-full py-8">
        <div className="flex flex-col gap-8 w-full">

          {/* Content Bar */}
          <div className="flex lg:flex-row lg:px-20 lg:min-h-[500px] lg:max-h-[500px] h-full flex-col gap-8 px-8">
            <div className="flex w-full items-center">
              <div className="lg:text-left text-center">
                <h2 className="lg:text-7xl text-6xl font-black mb-4">Headlight <p className="text-blue inline">Restoration<br></br></p>Services</h2>
                <p className="lg:mb-8 mb-6 text-lg lg:w-2/3">Restores clarity to headlights that have become foggy, discolored, or yellowed due to sun damage and continuous exposure to environmental factors. This service typically takes less than an hour to complete.</p>
                <a href="#schedule" className="px-4 py-2 border-2 border-blue bg-blue text-white font-bold rounded-full">Schedule Now</a>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="rounded-xl overflow-hidden">
              <img src={Photo1} loading="lazy" alt="Headlight Restoration Effect" className="w-full lg:h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
