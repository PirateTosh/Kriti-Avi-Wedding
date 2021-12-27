import React from "react"
import { getSponsors, getWelcomeDetails } from "../../selectors"
import { connect } from "react-redux"
import styled from "styled-components"
import cloneDeep from "lodash/cloneDeep"
import _ from 'lodash'
import Speakerslider from '../../components/slider/speakerSlider'
import { fetchSponsors } from '../../api/sponsors'
import $ from 'jquery';
import { isMobile } from '../../config/config.js';

const SponsorPage = styled.div`
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
class sponsorPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      welcomeData: cloneDeep(props.welcomeData),
      sponsors : cloneDeep(props.sponsors)
    }
  }
  componentDidMount(){
    fetchSponsors()
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.sponsors) {
      fetchSponsors()
    }
  }
  render() {
    if (isMobile) {
      $("#spanHeaderText").html("Sponsors");
    }
    let sponsors = this.props && this.props.sponsors
    let pages = _.sortBy(sponsors, ['sequence'])
    console.log('States ::', this.props)
    return (
      <SponsorPage>
        <PageTitle></PageTitle>
        <PageContent>
          <Speakerslider items={pages}/>
        </PageContent>
      </SponsorPage>
    )
  }
}

function mapStateToProps(state) {
  return {
    welcomeData: getWelcomeDetails(state),
    sponsors: getSponsors(state)
  }
}

export default connect(mapStateToProps)(sponsorPage)