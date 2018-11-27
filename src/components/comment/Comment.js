import React, { Component } from 'react'
import { createComment, getComments, deleteComment, editComment, updateComment } from '../../store/actions/commentActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Comment extends Component {

  state = {
     content: '',
     isEditing: false
  }

  componentDidMount () {
   const { city } = this.props;
   this.props.getComments(city.cityId)
  }

  componentWillReceiveProps (nextProps) {
     if(nextProps.comment.editComment){
      console.log("Edit selected", nextProps.comment.editComment)
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
   console.log("Edit clicked, comment ID:", commentId)
   this.props.editComment(commentId)
   }

   handleDelete = (commentId) => {
   console.log("Delete clicked, comment ID:", commentId)
   this.props.deleteComment(commentId)
   }

  render() {
    const { comment, auth } = this.props
    return (
      <div>
        <h1>Comments</h1>
        {auth.uid ? 
         <form onSubmit={this.state.isEditing ? this.handleUpdate : this.handleSubmit}>
            <div className="input-field">
               <textarea name="content" id="content" onChange={this.handleChange} value={this.state.content} rows="4" cols="50"></textarea>
               <label htmlFor="content">Add a comment...</label>
            </div>
            <div className="input-field">
               <button className="btn">{this.state.isEditing ? 'Update' : 'Post'}</button>
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
                     <li className='collection-item'>{comment.content}</li>
                     <li className='collection-item'>Posted by: {comment.userFirstName}, {comment.userFirstName[0]}</li>
                     {comment.userId === auth.uid 
                     ? 
                     <div>
                        <button className='btn warning' onClick={() => this.handleEdit(comment.id)}>Edit</button>
                        <button className='btn danger' onClick={() => this.handleDelete(comment.id)}>Delete</button>
                     </div>
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
   console.log("Comment State", state)
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
