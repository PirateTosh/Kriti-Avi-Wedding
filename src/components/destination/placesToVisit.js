import React from "react";
import './destination.css';
import AliceCarousel from 'react-alice-carousel';
import '../../config/config.js';
import Slider from 'react-slick';
import $ from 'jquery';
import Linkify from "react-linkify";
const PlacesToVisit = ({ places, images1, images2, images3 }) => {
  let destinationPlaces = places.destinationPlacesToVisit;
  const responsive = {
    0: {
      items: 1
    }
  };
  $('.backIcon').show();
  $('.backIconMobile').show();
  // $('#chatBackIcon').show();
  // $('#chatBackIcon').click(function (e) {
  //   $('#chatBackIcon').hide();
  //   e.preventDefault();
  //   this.setState({
  //     showChatMessages: false,
  //   });
  // }.bind(this));
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };
  $('html').scrollTop(0);
  return (
    <div>
      <div>
        <span className="d-none d-sm-block visitTiPlaceHeading appBodyFontColor appBodyFontFamily">DESTINATION</span>
        <h4 className="placesToVisitHeading appBodyFontColor appBodyFontFamily">PLACES TO VISIT</h4>
        <div className=" d-none d-sm-block">
          <div className="row destinationImage" style={{ marginBottom: "20px" }}>
            <div className="destinationCls card-deck">
              {
                destinationPlaces && destinationPlaces.map(place => {
                  let index = destinationPlaces.indexOf(place);
                  if (place.title && place.description && place.title.length && place.description.length) {
                    return (

                      <div className="destinationDetails card appGradientColor" key={place.title}>
                        <figure className="figure bridgeImage">
                          <img src={(index === 0) ? images1 : (index === 1) ? images2 : (index === 2) ? images3 : ""} className="figure-img img-fluid rounded img-responsive " alt='Not found' />
                          <div className="destination-data appGradientColor">
                            <figcaption className="figure-caption appBodyFontFamily appBodyFontColor text-left" >
                              <span className="mainheadingCommon">{place.title}</span>
                              <p className="paragraphCommon lineFormat"><Linkify properties={{target: '_blank'}}>{place.description}</Linkify></p>
                            </figcaption>
                          </div>
                        </figure>
                      </div>
                    )
                  }
                })
              }
            </div>
          </div>
        </div>
        <div className=" d-md-none d-lg-none d-xl-none places-to-visit-mobile">
          <div className="destinationImage">
            <Slider {...settings}>
              {
                destinationPlaces && destinationPlaces.map(place => {
                  let index = destinationPlaces.indexOf(place);
                  return (
                    <div className="destinationDetails1 owl-item" key={place.title}>
                      <figure className="figure bridgeImage">
                        <img src={(index === 0) ? images1 : (index === 1) ? images2 : (index === 2) ? images3 : ""} className="figure-img img-fluid rounded img-responsive " alt='Not found' />
                        <div className="destination-data-mobile appGradientColor">
                          <figcaption className="figure-caption  appBodyFontColor appBodyFontFamily text-left" >
                            <span className="mobileHeadingFontSize">{place.title}</span>
                            <p className="paragraphCommon lineFormat ptvFix"><Linkify properties={{target: '_blank'}}>{place.description}</Linkify></p>
                          </figcaption>
                        </div>
                      </figure>
                    </div>
                  )
                })
              }
            </Slider>
          </div>
        </div>
      </div>
    </div>
  )
};

export default PlacesToVisit;