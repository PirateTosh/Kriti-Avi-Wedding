import React from "react"
import { browserHistory } from "react-router"
import { getEventId, getWelcomeDetails } from "../../selectors"
import { connect } from "react-redux"
import styled from "styled-components"
import cloneDeep from "lodash/cloneDeep"
import { getAppDetails } from "../../selectors"

const MenuContainer = styled.div`
  position : relative;
  max-width : 800px;
  margin : 0 auto;
`

const MenuItemWrapper = styled.div`
  position : relative;

`
const MenuIcon = styled.div`
  position : relative;

`
const MenuTitle = styled.div`
  position : relative;

`

const MenuItem = (item) => 
  <MenuItemWrapper onClick={() => { browserHistory.push(item.link) }}>
    <MenuIcon icon={item.icon}/>
    <MenuTitle>{item.title}</MenuTitle>
  </MenuItemWrapper>

class MenuItems extends React.Component {
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
      <MenuContainer>
        <div>XXYXXIXJJXJXXJ</div>
        <ul>
          <li>
            <a href="/destination">Destination</a>
          </li>
        </ul>
      </MenuContainer>
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

export default connect(mapStateToProps)(MenuItems)