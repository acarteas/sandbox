import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

/*
axios('https://api-v2v3search-0.nuget.org/query?q=FileCache&prerelease=false')
         .then(result => this._isMounted && this.setSearchTopStories(result.data))
         .catch(error => this._isMounted && this.setState({ error }));
*/

class App extends Component {
   
   constructor(props){
      super(props);
      this.state = {
         results: null
      };

      //bind function to object (allows for correct usage of *this*)
      this.handleNugetResponse = this.handleNugetResponse.bind(this);
   }

   handleNugetResponse(response){
      let data = response.data[0];
      let title = data.title;
      let downloads = data.downloads;
   }

   

   componentDidMount(){
      axios('https://api-v2v3search-0.nuget.org/query?q=FileCache&prerelease=false')
         .then(result => this.handleNugetResponse(result.data))
         .catch();
   }
  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;
