import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import Footer from '../components/Footer';

const PartnerPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-between">
      <HeaderMenu />
      <div className="p-4 flex flex-col items-center gap-2">
        <h1 className="text-center lg:text-8xl text-6xl lg:mb-8 mb-0 font-black">We are now<br></br>giving<br></br>opportunity!</h1>
        <p className="text-center font-semibold text-lg">You can become <strong className="text-blue">Car Medic</strong> today, and start your headlights restoration business.</p>
        <p className="text-center lg:w-1/3">We will create you an service provider account and will add you to our providers list. We will train you well and give you all needed materials and certifications.
            You will also get your own link that will led your customers to your schedule form. You will get up to 70% of revenue as a provision! How does that sound?
        </p> 
        <button className="bg-blue px-8 py-4 rounded-full lg:mt-9 mt-1 text-white font-bold">Click here to apply</button>
        </div>
      <Footer />
    </div>
  );
};

export default PartnerPage;
