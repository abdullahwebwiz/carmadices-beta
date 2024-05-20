import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import Footer from '../components/Footer';
import Photo1 from '../assets/13569.jpg';
import ContentContainer from '../components/landingPage/ContentContainer';
import Star from '../assets/star.svg';
import CheckMark from '../assets/checkmark.svg';

const DealersPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-between">
      <HeaderMenu />
      {/* Main container */}
      <div className="flex w-full pt-8">
        <div className="flex flex-col gap-8 w-full">

          {/* Content Bar */}
          <div className="flex lg:flex-row lg:px-20 lg:min-h-[500px] lg:max-h-[500px] h-full flex-col gap-8 px-8">
            <div className="flex w-full items-center">
              <div className="lg:text-left text-center">
                <h2 className="lg:text-7xl text-6xl font-black mb-4">Are you running car <p className="text-blue inline">dealership?</p></h2>
                <p className="lg:mb-8 mb-6 text-lg lg:w-2/3">As a car dealership owner, you understand the importance of presenting vehicles in their best light to potential buyers. However, foggy, yellowed headlights can detract from the overall visual appeal of your inventory, leaving a negative impression on customers.</p>
                <a href="#schedule" className="px-4 py-2 border-2 border-blue bg-blue text-white font-bold rounded-full">Schedule Now</a>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="rounded-xl flex-1 overflow-hidden">
              <img src={Photo1} loading="lazy" alt="Headlight Restoration Effect" className="w-full lg:h-full object-cover" />
              </div>
            </div>
          </div>

          <ContentContainer/>



        </div>
      </div>

      <div className="bg-dark-blue lg:py-16 py-10 lg:px-20 px-8 flex items-center">
        <div className="lg:max-w-[1420px] lg:mx-auto lg:flex lg:flex-row lg:gap-4">
            <div className="flex flex-col items-center text-white gap-2 justify-center">
                <h1 className="text-center lg:text-left font-black text-5xl">Quick and Easy</h1>
                <h2 className="text-center lg:text-left font-bold text-xl text-blue">Not only looks better, but drasticaly brings value up!</h2>
                <div className="flex flex-row gap-2 lg:mt-2 lg:mb-10 mt-2 mb-6 justify-center lg:justify-normal">
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                </div>
                
                <div className="grid lg:grid-cols-3 grid-cols-2 lg:grid-rows-2 grid-rows-3 lg:w-2/3 items-center text-xl text-center gap-4 lg:mb-10 lg:p-0">
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Restored headlights give vehicles a fresh, well-maintained look, making them more visually appealing to customers browsing your lot.</div>
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Clear headlights improve visibility during nighttime driving, enhancing safety for drivers and passengers alike. Do you agree?</div>
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Instead of replacing entire headlight assemblies, our restoration service offers a cost-effective alternative, saving you money!</div>
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Our team comes directly to your lot, providing efficient on-site service with a turnaround time of just 20 minutes per pair of headlights.</div>
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Impress your customers with well-maintained vehicles that exude quality and care. A visually appealing car is more likely sell.</div>
                <div className="flex h-full flex-row items-center border p-4 rounded-lg">Don't let dull headlights dim the appeal of your dealership's inventory. Contact us today to schedule our headlight restoration service!</div>
                </div>

                <div className="flex gap-4 mt-2 px-4 lg:px-0">
                <a href="#schedule" className="border-2 border-blue bg-blue py-4 lg:py-2 px-6 lg:flex-initial flex-1 rounded-full text-center">Schedule Your Car Headlights Restoration</a>
                </div>
            </div>
        </div>
    </div>

      <Footer />
    </div>
  );
};

export default DealersPage;
