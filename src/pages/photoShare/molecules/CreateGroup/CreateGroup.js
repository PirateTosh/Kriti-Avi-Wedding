import React, { Fragment } from "react";
import { string, array, func, object } from "prop-types";

import _ from "lodash";

import store from "../../../../store";
import { dataSavedSuccessfully } from "../../../../actions/popup.action";

import { createGroup } from "../../../../api/photoShared";

import Spinner from "../../../../common/atoms/Spinner";

import {
  GroupContainer,
  Input,
  SearchContainer,
  ResultContainer
} from "./CreateGroup.styles";

class CreateGroup extends React.PureComponent {
  static propTypes = {
    groupInfo: object,
    className: string,
    guestsList: array.isRequired,
    guestId: string.isRequired,
    onGroupCreate: func.isRequired,
    groupsList: array
  };

  static defaultProps = {
    className: "",
    groupInfo: {},
    groupsList: []
  };

  constructor(props) {
    super(props);
    const editGroupInfo = {
      groupName: "",
      selectedMember: {
        [props.guestId]: true
      }
    };
    if (props.groupInfo._id) {
      editGroupInfo.groupName = props.groupInfo.groupName;
      editGroupInfo.selectedMember = props.groupInfo.members.reduce(
        (accum, memberId) => {
          accum[memberId] = true;
          return accum;
        },
        {}
      );
    }
    this.state = {
      membersList: [],
      searchString: "",
      loading: false,
      ...editGroupInfo
    };
    window.scrollTo(0, 0);
  }

  onGuestSearch(e) {
    const value = e.target.value.trim();
    this.setState({
      searchString: value,
      membersList: value
        ? this.props.guestsList.filter(member => {
            return `${member.guestFirstName.trim()} ${member.guestLastName.trim()}`
              .toLowerCase()
              .startsWith(value.toLowerCase());
          })
        : []
    });
  }

  onGroupCreate() {
    const isGroupExist = this.props.groupsList.find(
      group => group.groupName.toLowerCase() === this.state.groupName.toLowerCase()
    );
    if (!isGroupExist || this.props.groupInfo._id) {
      const data = {
        createdBy: this.props.guestId,
        groupName: this.state.groupName,
        members: Object.keys(this.state.selectedMember).reduce((accum, key) => {
          if (this.state.selectedMember[key]) {
            accum.push(key);
          }
          return accum;
        }, [])
      };
      if (this.props.groupInfo._id) {
        data._id = this.props.groupInfo._id;
      }
      this.setState({ loading: true }, () => {
        createGroup(data).then(response => {
          this.props.onGroupCreate(response);
        });
      });
    }else{
      store.dispatch(
        dataSavedSuccessfully("Oops! Group already exist with this name.")
      );
    }
  }

  selectMember(checked, guestId) {
    const memberList = { ...this.state.selectedMember };
    memberList[guestId] = checked;
    memberList[this.props.guestId] = true;
    this.setState(
      {
        selectedMember: memberList
      },
      () => {
        this.forceUpdate();
        document.getElementById("searchText").focus();
      }
    );
  }

  render() {
    return (
      <GroupContainer>
        <div className="form-group">
          <label htmlFor="groupName" className="m-0">
            Enter group name
          </label>
          <Input
            className="form-control form-control-color"
            type="text"
            value={this.state.groupName}
            id="groupName"
            name="groupName"
            onChange={e => this.setState({ groupName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="searchText" className="m-0">
            Select group members
          </label>
          <SearchContainer>
            <Input
              className="form-control form-control-color"
              type="text"
              value={this.state.searchString}
              id="searchText"
              name="searchText"
              onChange={e => this.onGuestSearch(e)}
              placeholder="Search member"
            />
            {this.state.membersList.length ? (
              <span
                className="clear px-2"
                onClick={() =>
                  this.setState({ membersList: [], searchString: "" })
                }
              >
                X
              </span>
            ) : null}
            {this.state.membersList.length ? (
              <ResultContainer>
                {this.state.membersList.map(member => (
                  <li key={member._id}>
                    <lable>
                      <input
                        type="checkbox"
                        value={member._id}
                        checked={this.state.selectedMember[member._id]}
                        onChange={e =>
                          this.selectMember(e.target.checked, e.target.value)
                        }
                      />
                      {member.guestTitle} {member.guestFirstName}{" "}
                      {member.guestLastName}
                    </lable>
                  </li>
                ))}
              </ResultContainer>
            ) : null}
          </SearchContainer>
          <ResultContainer className="selected">
            {this.props.guestsList.map(member => (
              <li
                key={member._id}
                style={{
                  display: this.state.selectedMember[member._id]
                    ? "block"
                    : "none"
                }}
              >
                <lable>
                  <input
                    type="checkbox"
                    value={member._id}
                    checked={this.state.selectedMember[member._id]}
                    onChange={e =>
                      this.selectMember(e.target.checked, e.target.value)
                    }
                  />
                  {member.guestTitle} {member.guestFirstName}{" "}
                  {member.guestLastName}
                </lable>
              </li>
            ))}
          </ResultContainer>
        </div>
        <div className="form-group">
          <button
            type="button"
            className="textboxTransparent btn btn-sm active mr-3"
            onClick={() => this.onGroupCreate()}
            disabled={
              !this.state.groupName ||
              !Object.keys(this.state.selectedMember).length
            }
          >
            {this.props.groupInfo._id ? "Save" : "Create"}
          </button>
          <button
            type="button"
            className="textboxTransparent btn btn-sm"
            onClick={this.props.onGroupCreate}
          >
            Cancel
          </button>
        </div>
        {this.state.loading ? <Spinner /> : ""}
      </GroupContainer>
    );
  }
}

export default CreateGroup;
