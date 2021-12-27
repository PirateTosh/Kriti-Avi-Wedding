import React from "react"
import styled from "styled-components"
import Slider from 'react-slick'
import Linkify from "react-linkify";

const SliderWrapper = styled.div`
  position : relative;
  .slick-dots{
    top: 40px;
  }
  .slick-track{
    display: flex;
    width: 30000vw;
    .slick-slide{
      display: flex;
      height: 100%;
      flex: 1;
      justify-content: flex-start;
      flex-direction: column;
    }
  }
`
const SliderContent = styled.div`
  position : relative;
  padding : 0.5em;
  div {
    position : relative;
  }
  button {
    display : flex;
    margin : 0 auto;
    margin-bottom: 3em;
    min-height: 2.5em;
    padding: 0 2em;
    background : transparent;
    height : auto;
    font-size: 14px;
    margin-bottom: 60px;
  }
  img{
    width : 100%;
    height : auto;
  }
  h1{
    font-size: 1.5em;
    padding-top : 1em;
  }
`
const SliderItemContent = styled.div`
  padding : 1em;
  padding-top: 0;
  h1, h4, p {
    font-weight : 400;
    font-size: 14px;
    line-height: 21px;
  }
`
const SliderItemWrapper = styled.div`
  position : relative;
  display : flex;
  color: #fff;
  width: 100%;
  height: 100%;
  max-width : 400px;
  margin : 0 auto;
  flex-direction: column;
  flex: 1;
`

const SliderItem = ({ item }) => 
  <SliderItemWrapper>
    <div>
      <img src={item.image} alt={item.name}/>
      <SliderItemContent className="content appGradientColor appBodyFontColor appBodyFontFamily">
      <div className="mobileHeadingFontSize">{item.name}</div>
      <div className="mobileHeadingFontSize">{item.intro}</div>
        <p className="lineFormat"><Linkify properties={{target: '_blank'}}>{item.about}</Linkify></p>
      </SliderItemContent>
    </div>
  </SliderItemWrapper>

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true
}

class Speakerslider extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let { items } = this.props
    return (
      <SliderWrapper>
        <Slider {...sliderSettings}>
          { items && items.map(a => {
            return(
              <SliderContent key={a.name}>
                <button className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily">{a.name}</button>
                <SliderItem item={a}/>
              </SliderContent>
            )
          })
          }
        </Slider>
      </SliderWrapper>
    )
  }
}

export default Speakerslider