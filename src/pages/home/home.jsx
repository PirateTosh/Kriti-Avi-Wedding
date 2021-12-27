import React from "react"
import { getEventId, getWelcomeDetails } from "../../selectors"
import { connect } from "react-redux"
import styled from "styled-components"
import cloneDeep from "lodash/cloneDeep"
import { getAppDetails } from "../../selectors"

import MenuItems from './menu'

const HomePage = styled.div`
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
class homePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      welcomeData: cloneDeep(props.welcomeData),
      appDetails: cloneDeep(props.appDetails)
    }
  }
  render() {
    let appData = this.props && this.props.welcomeData;
    let pages = appData && appData.aboutpages
    return (
      <HomePage>
        <PageTitle>Home Page</PageTitle>
        <PageContent>
          <MenuItems />
        </PageContent>
      </HomePage>
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

export default connect(mapStateToProps)(homePage)