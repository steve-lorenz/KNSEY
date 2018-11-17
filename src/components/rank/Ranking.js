import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Ranking extends Component {
   render () {
      const { auth } = this.props;

      if(!auth.uid) return <Redirect to="/signin" />

      return (
         <div className="container">
            <h1>Ranking</h1>
         </div>
      )
}

}

const mapStateToProps = (state) => {
   console.log(state);
   return {
      auth: state.firebase.auth
   }
}

export default connect(mapStateToProps)(Ranking)