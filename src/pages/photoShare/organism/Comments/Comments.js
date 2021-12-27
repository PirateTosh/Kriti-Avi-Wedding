import React, { Fragment } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

import _ from "lodash";
import { distanceInWordsToNow } from "date-fns";

import { getCommentsList, getParentComment } from "../../stateSelector";
import { fetchCommentsList, commentOnPhoto } from "../../../../api/photoShared";

import {
  CommentWarpper,
  List,
  Header,
  Footer,
  SendIcon
} from "./Comments.styles";

import { PHOTOS } from "../../../../constants";

class Comments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      parentComment: {
        _id: props.parentCommentId
      },
      comment: "",
      comments: []
    };
    window.scrollTo(0, 0);
  }
  componentDidMount() {
    fetchCommentsList({
      photoId: this.props.photo._id,
      parentCommentId: this.props.parentCommentId
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.parentCommentId !== this.props.parentCommentId) {
      fetchCommentsList({
        photoId: this.props.photo._id,
        parentCommentId: nextProps.parentCommentId
      });
    } else if (nextProps.comments !== this.props.comments) {
      this.setState({ comments: nextProps.comments });
    }
  }

  postComment() {
    const { parentComment } = this.state;
    commentOnPhoto({
      photoId: this.props.photo._id,
      commentedBy: this.props.guestId,
      commentText: this.state.comment,
      parentCommentId: parentComment._id
    }).then(res => {
      this.setState({
        comment: "",
        parentComment: {
          _id: this.props.parentCommentId
        }
      });
    });
  }

  replyOnComment(comment) {
    this.commentInput.focus();
    this.setState({ parentComment: comment });
  }

  redirect(commentId) {
    browserHistory.push(
      `/${PHOTOS.LANDING}/${this.props.photo._id}/${
        PHOTOS.LANDING_SUB_PATH.COMMENTS
      }/${commentId}`
    );
  }

  resetParentComment() {
    this.setState({
      parentComment: {
        _id: this.props.parentCommentId
      }
    });
  }

  render() {
    const { photo, parentComment: pComment } = this.props;
    const { comments, parentComment } = this.state;
    
    return (
      <CommentWarpper className="appGradientColor">
        <Header>
          <span>COMMENTS</span>
          <p>{photo.caption}</p>
        </Header>
        <hr />
        <List className={pComment ? "nesting" : ""}>
          {pComment && (
            <li className="parentComment d-flex justify-content-start align-items-center">
              <span className="thumb align-self-star">
                {pComment.guest && pComment.guest.guestFirstName.charAt(0)}
              </span>
              <div>
                <span className="comment">{pComment.commentText}</span>
              </div>
            </li>
          )}
          {comments.map(comment => (
            <li
              key={comment._id}
              className="d-flex justify-content-start align-top"
            >
              <span className="thumb align-self-star">
                {/* {comment.guest && comment.guest.guestFirstName.charAt(0)} */}
                {comment.guest && comment.guest.guestFirstName.charAt(0)}
              </span>
              <div>
                <span style={{fontWeight:"600"}}>{comment.guest && comment.guest.guestFirstName} {comment.guest && comment.guest.guestLastName}</span>
                <span className="comment">{comment.commentText}</span>
                <div className="d-flex flex-wrap actionList">
                  <span>{distanceInWordsToNow(comment.createdAt)}</span>
                  <span>|</span>
                  <span
                    onClick={() => this.replyOnComment(comment)}
                    className="pointer"
                  >
                    Reply
                  </span>
                  {comment.childCount && (
                    <Fragment>
                      <span>|</span>
                      <span
                        onClick={() => this.redirect(comment._id)}
                        className="pointer"
                      >
                        See ({comment.childCount.count}) Replies
                      </span>
                    </Fragment>
                  )}
                </div>
              </div>
            </li>
          ))}
        </List>
        <Footer className="appGradientColor">
          <div className="form-group">
            {!pComment && parentComment._id && (
              <span
                className="clear pull-right pointer"
                onClick={() => this.resetParentComment()}
              >
                X
              </span>
            )}
            <span className="label">
              {parentComment._id
                ? `Reply to comment ${
                    parentComment.commentText ? parentComment.commentText : ""
                  }`
                : "New comment"}
            </span>
            <input
              autoComplete="off"
              className="form-control"
              type="text"
              value={this.state.comment}
              name="comment"
              onChange={e => this.setState({ comment: e.target.value })}
              placeholder="Add a comment"
              ref={input => {
                this.commentInput = input;
              }}
            />
            <SendIcon
              className="appBodyFontColor pull-right"
              onClick={() => this.postComment()}
              disabled={!this.state.comment.trim()}
            >
              Post
              <i className="icon-send-button" />
            </SendIcon>
          </div>
        </Footer>
      </CommentWarpper>
    );
  }
}

function mapStateToProps(state) {
  return {
    comments: getCommentsList(state),
    parentComment: getParentComment(state)
  };
}

export default connect(mapStateToProps)(Comments);
