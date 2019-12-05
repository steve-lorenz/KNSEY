import React, { Component } from 'react'
import { createComment, getComments, deleteComment, editComment, updateComment } from '../../store/actions/commentActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

class Comment extends Component {

  state = {
     content: '',
     isEditing: false,
  }

  componentDidMount () {
   const { cityStuff } = this.props;
   this.props.getComments(cityStuff.cityId)
  }

  componentWillReceiveProps (nextProps) {
     if(nextProps.comment.editComment){
      this.setState({
         content: nextProps.comment.editComment.content,
         isEditing: true
      })
     }
  }
  
  handleChange = (e) => {
     this.setState({
        [e.target.id]: e.target.value
     })
  }

  handleSubmit = (e) => {
      e.preventDefault();
      console.log("comment add", this.state)
      this.props.createComment(this.state)
      this.setState({
         content: ''
      })
  }

   handleUpdate = (e) => {
      const { comment } = this.props
      e.preventDefault();
      this.props.updateComment({
         id: comment.editComment.id,
         cityId: comment.editComment.cityId,
         content: this.state.content,
         userFirstName: comment.editComment.userFirstName,
         userId: comment.editComment.userId,
         userLastName: comment.editComment.userLastName
      })
      this.setState({
         content: '',
         isEditing: false
      })
   }

   handleEdit = (commentId) => {
      this.props.editComment(commentId)
   }

   handleDelete = (commentId) => {
      this.props.deleteComment(commentId)
   }

  render() {
    const { comment, auth } = this.props;
    const { profile } = this.props;
    return (
      <div>
        <h1>Comments</h1>
        {auth.uid ? 
         <form onSubmit={this.state.isEditing ? this.handleUpdate : this.handleSubmit}>
            <div className="input-field">
               <textarea name="content" data-test="comment-content" id="content" onChange={this.handleChange} value={this.state.content} rows="4" cols="50"></textarea>
               <label htmlFor="content">Add a comment...</label>
            </div>
            <div className="input-field">
               <button aria-label="Update" data-test="comment-btn" className="btn">{this.state.isEditing ? 'Update' : 'Post'}</button>
            </div>
         </form>
        : 
        <span>Sign in to leave a comment...</span>
        }
        <div>
            {comment.comments ?
               comment.comments.map(comment => {
                  return(
                  <ul key={comment.id} className="collection">
                     <li className='collection-item' data-test="comment-collection-item">{comment.content}</li>
                     <li className='collection-item'>
                     Posted by: {comment.userFirstName} {comment.userLastName[0]}
                     <span>{comment.updatedAt ? `Updated: ${moment(new Date(comment.updatedAt.seconds*1000)).calendar()}` : 
                        `Posted: ${moment(new Date(comment.createdAt.seconds*1000)).calendar()}`}</span>
                     </li>
                     {comment.userId === auth.uid || profile.role === 3
                     ?
                        !this.state.isEditing ?
                           <div>
                              <button aria-label="Edit" data-test="comment-edit-btn" className='btn warning' onClick={() => this.handleEdit(comment.id)}>Edit</button>
                              <button aria-label="Delete" data-test="comment-delete-btn" className='btn danger' onClick={() => this.handleDelete(comment.id)}>Delete</button>
                           </div>
                        : null
                     : null
                     }
                  </ul>
                  )
               })
            :
            null
            }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
   return {
     auth : state.firebase.auth,
     comment: state.comment,
     city: state.city,
     profile: state.firebase.profile
   }
 }
 
 const mapDispatchToProps = (dispatch) => {
    return {
      ...bindActionCreators({ createComment, getComments, deleteComment, editComment, updateComment }, dispatch)
    }
 }
 

export default connect(mapStateToProps, mapDispatchToProps)(Comment)
