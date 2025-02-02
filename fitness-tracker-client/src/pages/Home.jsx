import React from "react";
import WhatWeOffer from "../components/WhatWeOffer";
import TrainingPrograms from "../components/TrainingPrograms";
import Banner from "../components/Banner";
import About from "../components/About";
import Newsletter from "../components/Newsletter";
import { Helmet } from "react-helmet-async";
import FeaturedClasses from "../components/FeaturedClasses";
import Testimonials from "../components/Testimonials";
import LatestCommunity from "../components/LatestCommunity";
import Team from "../components/Team";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Fitverse | Home</title>
      </Helmet>
      <Banner />
      <About />
      <WhatWeOffer />
      <TrainingPrograms />
      <FeaturedClasses />
      <Testimonials />
      <LatestCommunity />
      <Team />
      <Newsletter />
    </div>
  );
};

export default Home;
