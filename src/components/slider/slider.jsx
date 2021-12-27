import React from "react"
import styled from "styled-components"
import Slider from 'react-slick'
import Linkify from 'react-linkify'

const SliderWrapper = styled.div`
  position : relative;
  .slick-dots{
    top: 40px;
    height: 50px;
    overflow: hidden;
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
  > div {
    position : relative;
 
  }
  button {
    display : flex;
    margin : 0 auto;
    margin-bottom: 3em;
    min-height: 2.5em;
    padding: 0 2em;
    height : auto;
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
  max-width : 400px;
  margin : 0 auto;
  flex-direction: column;
`

const SliderItem = ({ item }) =>
  <SliderItemWrapper className="appGradientColor">
    <div>
      <img src={item.aboutPageImg} alt={item.aboutPageTitle} />
      <SliderItemContent>
        <div className="about-destination appBodyFontColor appBodyFontFamily">
          <div className="mobileHeadingFontSize">{item.aboutPageTitle}</div>
          <p className="lineFormat"><Linkify properties={{target: '_blank'}}>{item.aboutPageContent}</Linkify></p>
        </div>

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

class SliderContainer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let { items } = this.props
    return (
      <SliderWrapper>
        <Slider {...sliderSettings}>
          {items && items.map(a => {
            return (
              <SliderContent key={a.aboutPageTitle}>
                <button className="appBodyFontColor text-center mobileBtnBridge appBodyFontFamily">{a.aboutPageTitle}</button>
                <SliderItem item={a} />
              </SliderContent>
            )
          })
          }
        </Slider>
      </SliderWrapper>
    )
  }
}

export default SliderContainer