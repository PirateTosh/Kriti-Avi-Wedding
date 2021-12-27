import React from "react"
import { getEventId, getWelcomeDetails } from "../../selectors"
import { connect } from "react-redux"
import styled from "styled-components"
import cloneDeep from "lodash/cloneDeep"
import { getAppDetails } from "../../selectors"
import _ from 'lodash'
import $ from 'jquery';
import SliderContainer from '../../components/slider/slider'
import { isMobile } from '../../config/config.js';
import { fetchWelcomeDetails } from "../../api/welcomeApi";

const AboutPage = styled.div`
  position : relative;
  max-width : 800px;
  margin : 0 auto;
`
const PageTitle = styled.div`
  color: #fff;
  padding: 1em;
  text-align: center;
  font-size: 1.75em;
`
const PageContent = styled.div`

`
class aboutPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      welcomeData: cloneDeep(props.welcomeData),
      appDetails: cloneDeep(props.appDetails)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.welcomeData) {
      fetchWelcomeDetails();
    }
    if (this.props.welcomeData !== nextProps.welcomeData) {
      this.setState({ welcomeData: cloneDeep(nextProps.welcomeData) });
    }
    if (this.props.appDetails !== nextProps.appDetails) {
      let appDetails = cloneDeep(nextProps.appDetails);
      this.setState({ appDetails: appDetails });
      if (isMobile) {
        if (appDetails.basicDetails.eventType === "wedding") {
          $("#spanHeaderText").html("Bride & Groom");
        }
        else {
          $("#spanHeaderText").html("About");
        }
      }
    }
  }
  render() {
  
    let appData = this.props && this.props.welcomeData;
    let pageList = appData && appData.aboutpages;
    let pages = _.sortBy(pageList, ['aboutPageSequence']);
    return (
      <AboutPage>
        <PageTitle></PageTitle>
        <PageContent>
          <SliderContainer items={pages}/>
        </PageContent>
      </AboutPage>
    )
  }
}

function mapStateToProps(state) {
  return {
    welcomeData: getWelcomeDetails(state),
    eventId: getEventId(state),
    appDetails: getAppDetails(state)
  }
}

export default connect(mapStateToProps)(aboutPage)