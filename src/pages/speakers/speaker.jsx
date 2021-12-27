import React from "react"
import { getSpeakers, getWelcomeDetails } from "../../selectors"
import { connect } from "react-redux"
import styled from "styled-components"
import cloneDeep from "lodash/cloneDeep"
import _ from 'lodash'
import Speakerslider from '../../components/slider/speakerSlider'
import { fetchSpeakers } from '../../api/speakers'
import $ from 'jquery';
import { isMobile } from '../../config/config.js';

const SpeakerPage = styled.div`
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
class speakerPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      welcomeData: cloneDeep(props.welcomeData),
      appDetails: cloneDeep(props.appDetails),
      speakers : cloneDeep(props.speakers)
    }
  }
  componentDidMount(){
    fetchSpeakers()
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.speakers) {
      fetchSpeakers()
    }
  }
  render() {
    if (isMobile) {
        $("#spanHeaderText").html("Speakers");
      }
    let speakers = this.props && this.props.speakers
    let pages = _.sortBy(speakers, ['sequence'])
    return (
      <SpeakerPage>
        <PageTitle></PageTitle>
        <PageContent>
          <Speakerslider items={pages}/>
        </PageContent>
      </SpeakerPage>
    )
  }
}

function mapStateToProps(state) {
  return {
    welcomeData: getWelcomeDetails(state),
    speakers: getSpeakers(state)
  }
}

export default connect(mapStateToProps)(speakerPage)