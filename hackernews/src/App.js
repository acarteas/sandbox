import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

function isSearched(searchTerm) {
   return function (item) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
   }
}

class App extends Component {
   constructor(props) {
      super(props);
      this.state = { searchTerm: DEFAULT_QUERY, result: null };

      //bind function to object (allows for correct usage of *this*)
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.setSearchTopStories = this.setSearchTopStories.bind(this);
   }

   onDismiss(id) {
      const updatedList = this.state.list.filter(item => { return item.objectID !== id });
      this.setState({ list: updatedList });
   }

   onSearchChange(evt) {
      this.setState({ searchTerm: evt.target.value });
   }

   setSearchTopStories(result){
       this.setState({result});
   }

   componentDidMount(){
      const {searchTerm} = this.state;
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
         .then(response => response.json())
         .then(result => this.setSearchTopStories(result))
         .catch(error=>error);
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
      if(result === null){
         return null;
      }
      return (
         <div className="page">
            <div className="interactions">
               <Search value={searchTerm} onChange={this.onSearchChange}>Search</Search>
            </div>
            <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />
         </div>
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

function Search({ value, onChange, children }) {
   return (
      <form>
         {children}
         <input type="text" value={value} onChange={onChange} />
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
            {list.filter(isSearched(pattern)).map(item =>
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
