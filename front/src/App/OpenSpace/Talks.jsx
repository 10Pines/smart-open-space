import React from 'react';

import Slider from 'react-slick';

import MyProps from '#helpers/MyProps';
import { NextIcon, PreviousIcon } from '#shared/icons';

const sliderSettings = {
  centerMode: false,
  arrows: true,
  dots: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextIcon />,
  prevArrow: <PreviousIcon />,
  responsive: [
    {
      breakpoint: 1550,
      settings: { slidesToShow: 3, slidesToScroll: 2 },
    },
    {
      breakpoint: 1220,
      settings: { slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 920,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
};

const Talks = ({ children }) => (
  <Slider {...sliderSettings} infinite={false} >
    {children}
  </Slider>
);
Talks.propTypes = { children: MyProps.children.isRequired };

export default Talks;
