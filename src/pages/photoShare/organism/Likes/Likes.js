import React from "react";
import { connect } from "react-redux";

import _ from "lodash";
import { distanceInWordsToNow } from 'date-fns';

import { getLikesList } from "../../stateSelector";
import { fetchLikesList } from "../../../../api/photoShared";

import {
  LikesWarpper,
  List,
  Header,
} from "./Likes.styles";

class Likes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      likes: []
    };
    window.scrollTo(0, 0);
  }
  componentDidMount() {
    fetchLikesList(this.props.photo._id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.likes !== this.props.likes) {
      this.setState({ likes: nextProps.likes });
    }
  }

  render() {
    const { likes } = this.state;
    return (
      <LikesWarpper className="appGradientColor">
        <Header>
          <span><i className="fa fa-heart" aria-hidden="true"></i> LIKES</span>
        </Header>
        <hr />
        <List>
          {likes.map(like =>
          <li key={like._id} className="d-flex justify-content-start align-top">
          <span className="thumb align-self-star">{like.guest.guestFirstName.charAt(0)}</span>
          <div>
            <small className="like">{like.guest.guestTitle} {like.guest.guestFirstName} {like.guest.guestLastName}</small>
            <small className="faded">{distanceInWordsToNow(like.createdAt)}</small>
            </div>
          </li>
          )}
        </List>
      </LikesWarpper>
    );
  }
}

function mapStateToProps(state) {
  return {
    likes: getLikesList(state)
  };
}

export default connect(mapStateToProps)(Likes);
