import React from 'react';
import Star from '../../assets/star.svg';
import CheckMark from '../../assets/checkmark.svg';
import Photo1 from '../../assets/headlight-4.jpg';
import Photo2 from '../../assets/headlight-5.jpg';
import Photo3 from '../../assets/headlight-6.jpg';
import Photo4 from '../../assets/headlight-7.jpg';


const SatisfactionGuaranteed = () => {
  return (
    <div className="bg-dark-blue lg:py-16 py-10 lg:px-20 px-8">
        <div className="lg:max-w-[1420px] lg:mx-auto lg:flex lg:flex-row lg:gap-4">
            <div className="lg:w-2/3 text-white self-center flex-1 gap-2 justify-center">
                <h1 className="text-center lg:text-left font-black text-5xl">Satisfaction Guaranteed</h1>
                <h2 className="text-center lg:text-left font-bold text-xl text-blue">Not only looks better, but drasticaly brings value up!</h2>
                <div className="flex flex-row gap-2 lg:mt-2 lg:mb-10 mt-2 mb-6 justify-center lg:justify-normal">
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                    <img src={Star} alt="My Car Medics Logo" className="h-8" />
                </div>
                
                <div className="flex flex-col gap-2 lg:mb-10 p-4 lg:p-0">
                <div className="flex flex-row items-center gap-2"><img src={CheckMark} alt="My Car Medics Logo" loading="lazy" className="h-8" />Restores clarity to cloudy, discolored headlights</div>
                <div className="flex flex-row items-center gap-2"><img src={CheckMark} alt="My Car Medics Logo" loading="lazy" className="h-8" />Brings back clear visibility to headlights</div>
                <div className="flex flex-row items-center gap-2"><img src={CheckMark} alt="My Car Medics Logo" loading="lazy" className="h-8" />UV-resistant sealant to shield headlights from sun damage</div>
                <div className="flex flex-row items-center gap-2"><img src={CheckMark} alt="My Car Medics Logo" loading="lazy" className="h-8" />Complimentary cost assessments</div>
                <div className="flex flex-row items-center gap-2"><img src={CheckMark} alt="My Car Medics Logo" loading="lazy" className="h-8" />Packages for every need and budget</div>
                </div>

                <div className="flex gap-4 mt-2 px-4 lg:px-0">
                <a href="#schedule" className="border-2 border-blue bg-blue py-4 lg:py-2 px-6 lg:flex-initial flex-1 rounded-full text-center">Schedule Your Car Headlights Restoration</a>
                </div>
            </div>
            
            <div className="lg:w-1/3 p-4 lg:p-0 flex-col lg:-translate-x-20">
            
            <div className="flex flex-row gap-4 mb-4 lg:translate-x-20">
            <div className="shadow-md">
                <div className="rounded-xl overflow-hidden">
                    <img src={Photo1} loading="lazy" alt="Headlight Restoration Effect" className="object-cover aspect-square" />
                </div>
            </div>
            <div className="shadow-md">
            <div className="rounded-xl overflow-hidden">
                    <img src={Photo2} loading="lazy" alt="Headlight Restoration Effect" className="object-cover aspect-square" />
                </div>
            </div>
            </div>

            <div className="flex flex-row gap-4">
            <div className="shadow-md">
            <div className="rounded-xl overflow-hidden">
            <img src={Photo3} loading="lazy" alt="Headlight Restoration Effect" className="object-cover aspect-square" />
                </div>
            </div>
            <div className="shadow-md">
            <div className="rounded-xl overflow-hidden">
            <img src={Photo4} loading="lazy" alt="Headlight Restoration Effect" className="object-cover aspect-square" />
                </div>
            </div>
            </div>

            </div>
        </div>
    </div>
  );
};

export default SatisfactionGuaranteed;
