import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

class App extends Component {
   constructor(props) {
      super(props);
      this.state = { searchTerm: DEFAULT_QUERY, result: null };

      //bind function to object (allows for correct usage of *this*)
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
      this.setSearchTopStories = this.setSearchTopStories.bind(this);
   }

   fetchSearchTopStories(searchTerm){
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
         .then(response => response.json())
         .then(result => this.setSearchTopStories(result))
         .catch(error => error);
   }

   onDismiss(id) {
      const isNotId = item => {
         return item.objectID !== id;
      };
      const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({ result: {...this.state.result, hits: updatedHits} });
   }

   onSearchChange(evt) {
      this.setState({ searchTerm: evt.target.value });
   }

   onSearchSubmit(evt){
      const {searchTerm} = this.state;
      this.fetchSearchTopStories(searchTerm);
      evt.preventDefault();
   }

   setSearchTopStories(result) {
      this.setState({ result });
   }

   componentDidMount() {
      const {searchTerm} = this.state;
      this.fetchSearchTopStories(searchTerm);
   }

   //alternate version of onDismiss that doesn't use bind in constructor
   /*
   onDismiss = (id) => {
      const updatedList = this.state.list.filter(item => { return item.objectID !== id });
      this.setState({ list: updatedList });
   }
   */

   render() {
      const { searchTerm, result } = this.state;
      return (
         <div className="page">
            <div className="interactions">
               <Search 
                  value={searchTerm} 
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}
                  >Search</Search>
            </div>
            {
               //TODO: figure out how to do more full-fledged conditional rendering
               result 
               ? <Table list={result.hits} onDismiss={this.onDismiss} />
               : <Loading />
            }
         </div>
      );
   }
}

class Loading extends Component{
   render(){
      return(
         <span>Loading...</span>
      );
   }
}

class Button extends Component {
   render() {
      const { onClick, className = '', children } = this.props;
      return (
         <button onClick={onClick} className={className} type="button">{children}</button>
      );
   }
}

function Search({ value, onChange, onSubmit, children }) {
   return (
      <form onSubmit={onSubmit}>
         <input type="text" value={value} onChange={onChange} />
         <button type="submit">{children}</button>
      </form>
   );
}

class Table extends Component {
   render() {
      const { list, pattern, onDismiss } = this.props;
      const largeColumn = {
         width: '40%',
      };
      const midColumn = {
         width: '30%',
      };
      const smallColumn = {
         width: '10%',
      };
      return (
         <div className="table">
            {list.map(item =>
               <div key={item.objectID} className="table-row">
                  <span style={largeColumn}>
                     <a href={item.url}>{item.title}</a>
                  </span>
                  <span style={midColumn}>{item.author}</span>
                  <span style={smallColumn}>{item.num_comments}</span>
                  <span style={smallColumn}>{item.points}</span>
                  <span>
                     <Button className="button-inline" onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
                  </span>
               </div>
            )}
         </div>
      );
   }
}

export default App;
