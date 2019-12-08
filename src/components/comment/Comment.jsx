import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  createComment, getComments, deleteComment, editComment, updateComment,
} from '../../store/actions/commentActions';

const Comment = ({
  createCommentAction,
  getCommentsAction,
  editCommentAction,
  deleteCommentAction,
  updateCommentAction,
  cityStuff,
  comment,
  auth,
  profile,
}) => {
  const [content, setContent] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentState, setEditCommentState] = useState('');
  const commentInput = useRef(null);

  useEffect(() => {
    getCommentsAction(cityStuff.cityId);
  }, [getCommentsAction, cityStuff.cityId]);

  useEffect(() => {
    if (comment.editComment) {
      setContent(comment.editComment.content);
      setIsEditing(true);
      setEditCommentState(comment.editComment);
    }
  }, [comment.editComment]);

  const handleChange = (setChange, e) => {
    setChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCommentAction({ content, isEditing });
    setContent('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateCommentAction({
      id: editCommentState.id,
      cityId: editCommentState.cityId,
      content,
      userFirstName: editCommentState.userFirstName,
      userId: editCommentState.userId,
      userLastName: editCommentState.userLastName,
    });
    setContent('');
    setIsEditing(false);
    setEditCommentState('');
  };

  const handleEdit = (commentId) => {
    commentInput.current.focus();
    editCommentAction(commentId);
  };

  const handleDelete = (commentId) => {
    deleteCommentAction(commentId);
  };

  return (
    <div>
      <h1>Comments</h1>
      {auth.uid
        ? (
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <label htmlFor="content">
                Add a comment...
              <textarea ref={commentInput} name="content" data-test="comment-content" id="content" onChange={(e) => handleChange(setContent, e)} value={content} rows="4" cols="50" />
            </label>
            <button type="submit" aria-label="Update" data-test="comment-btn" className="btn">{isEditing ? 'Update' : 'Post'}</button>
          </form>
        )
        : <span>Sign in to leave a comment...</span>}
      <div>
        {comment.comments
          ? comment.comments.map((cityComment) => (
            <ul key={cityComment.id} className="collection">
              <li className="collection-item" data-test="comment-collection-item">{cityComment.content}</li>
              <li className="collection-item">
                     Posted by:
                {' '}
                {cityComment.userFirstName}
                {' '}
                {cityComment.userLastName[0]}
                <span>
                  {cityComment.updatedAt ? `Updated: ${moment(new Date(cityComment.updatedAt.seconds * 1000)).calendar()}`
                    : `Posted: ${moment(new Date(cityComment.createdAt.seconds * 1000)).calendar()}`}

                </span>
              </li>
              {((cityComment.userId === auth.uid || profile.role === 3) && !isEditing) && (
                <div>
                  <button type="button" aria-label="Edit" data-test="comment-edit-btn" className="btn warning" onClick={() => handleEdit(cityComment.id)}>Edit</button>
                  <button type="button" aria-label="Delete" data-test="comment-delete-btn" className="btn danger" onClick={() => handleDelete(cityComment.id)}>Delete</button>
                </div>
              )}
            </ul>
          ))
          : null}
      </div>
    </div>

  );
};

Comment.propTypes = {
  createCommentAction: PropTypes.func.isRequired,
  getCommentsAction: PropTypes.func.isRequired,
  editCommentAction: PropTypes.func.isRequired,
  deleteCommentAction: PropTypes.func.isRequired,
  updateCommentAction: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    role: PropTypes.number,
  }).isRequired,
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    uid: PropTypes.string,
  }).isRequired,
  cityStuff: PropTypes.shape({
    cityId: PropTypes.string,
  }).isRequired,
  comment: PropTypes.shape({
    id: PropTypes.string,
    comments: [{
      userId: PropTypes.string,
    }],
    editComment: {
      content: PropTypes.string,
    },
  }),
};

Comment.defaultProps = {
  comment: {},
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  comment: state.comment,
  city: state.city,
  profile: state.firebase.profile,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    createCommentAction: createComment,
    getCommentsAction: getComments,
    deleteCommentAction: deleteComment,
    editCommentAction: editComment,
    updateCommentAction: updateComment,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Comment);
