import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import _ from "lodash";

import { getAllGuests, getGuestGroups } from "../../stateSelector";
import { fetchAllGuests, fetchGuestGroups } from "../../../../api/photoShared";

import { GroupPage, PageContent, Header } from "./Groups.styles";

import CreateGroup from "../../molecules/CreateGroup";
import Spinner from "../../../../common/atoms/Spinner";

class Groups extends React.PureComponent {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      groupInfo: {},
      guestId:
        isLoggedIn == "true" ? window.localStorage.getItem("guestId") : null,
      loading: false
    };
  }
  componentDidMount() {
    fetchGuestGroups(this.state.guestId);
  }

  onGroupSelect(value) {
    if (!this.props.guestsList.length) {
      fetchAllGuests();
    }

    this.setState({ groupInfo: value || {}, createNewGroup: true });
  }

  onGroupCreate(groupInfo) {
    this.setState({
      createNewGroup: false,
      groupInfo: groupInfo ? groupInfo : {}
    });
  }

  render() {
    const { groupsList } = this.props;

    return (
      <GroupPage className="appBodyFontFamily appBodyFontColor appGradientColor">
        <PageContent>
          <form
            autoComplete="off"
            className="invitationMessage appGradientColor"
          >
            {!this.state.createNewGroup ? (
              <Fragment>
                <Header>
                  <span>
                    <i className="fa fa-users" aria-hidden="true" /> My Groups
                  </span>
                  <span
                    className="fa fa-plus"
                    onClick={() => this.onGroupSelect()}
                  >
                    Create New
                  </span>
                </Header>
                <hr />

                <div className="groups-list">
                  {groupsList.map(group => {
                    return (
                      <div className="p-2 mb-3 rounded" key={group._id}>
                        {group.createdBy === this.state.guestId ? (
                          <span
                          className="fa fa-pencil pull-right"
                          onClick={() => this.onGroupSelect(group)}
                          />
                        ) : null}
                        <span>{group.groupName}</span>
                      </div>
                    );
                  })}
                </div>
              </Fragment>
            ) : (
              <CreateGroup
                guestsList={this.props.guestsList}
                guestId={this.state.guestId}
                onGroupCreate={groupInfo => this.onGroupCreate(groupInfo)}
                groupInfo={this.state.groupInfo}
                groupsList={groupsList}
              />
            )}
            {this.state.loading ? <Spinner /> : ""}
          </form>
        </PageContent>
      </GroupPage>
    );
  }
}

function mapStateToProps(state) {
  return {
    guestsList: getAllGuests(state),
    groupsList: getGuestGroups(state)
  };
}

export default connect(mapStateToProps)(Groups);
