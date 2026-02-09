import React from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import SalleList from '../components/SalleList';
import Newsletter from '../components/Newsletter';
import Presentation from '../components/Presentation';
import Footer from '../components/Footer';

const Home = (): React.ReactElement => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Carousel />
        <div className="px-3">
          <SalleList />
          <Presentation />
          <Newsletter />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
