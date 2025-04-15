import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Removed import "./css/VehicleCarousel.css" since styles are in HomePage.css

const VehicleCarousel = ({ vehicles }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    setNav1(new Slider(".vehicle-slider", {
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: false, // Prevents next image from poking out
      slidesToShow: 1, // Ensures only one slide is shown
      slidesToScroll: 1,
      infinite: true,
      dots: false,
      arrows: false,
    }));
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: false, // Prevents next image from poking out
    slidesToShow: 1, // Ensures only one slide is shown
    slidesToScroll: 1,
    infinite: true,
    dots: false,
    arrows: false,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} className="vehicle-slider">
        {vehicles.map((vehicle) => (
          <a
            key={vehicle._id}
            href={`/vehicle/${vehicle._id}`}
            className="carousel-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="carousel-card">
              <img
                src={
                  vehicle.images && vehicle.images.length > 0
                    ? vehicle.images[0]
                    : "placeholder.jpg"
                }
                alt={`${vehicle.make} ${vehicle.model}`}
                className="carousel-image"
              />
              <div className="carousel-price">
                ₹{vehicle.price.toLocaleString("en-IN")}
              </div>
            </div>
          </a>
        ))}
      </Slider>
    </div>
  );
};

export default VehicleCarousel;