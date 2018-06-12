import React, { Component } from 'react';
import axios from 'axios'
import { sortBy } from 'lodash';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
const SORTS = {
   NONE: list => list,
   TITLE: list => sortBy(list, 'title'),
   AUTHOR: list => sortBy(list, 'author'),
   COMMENTS: list => sortBy(list, 'num_comments').reverse(),
   POINTS: list => sortBy(list, 'points').reverse(),
};
console.log(url);

class App extends Component {

   //allows us to abord unneeded fetch / update calls after component unmounts
   _isMounted = false;

   constructor(props) {
      super(props);
      this.state = {
         searchTerm: DEFAULT_QUERY,
         results: null,
         searchKey: '',
         error: null,
         isSortReverse: false,
      };

      //bind function to object (allows for correct usage of *this*)
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit = this.onSearchSubmit.bind(this);
      this.setSearchTopStories = this.setSearchTopStories.bind(this);
      this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
   }

   needsToSearchTopStories(searchTerm) {
      return !this.state.results[searchTerm];
   }

   fetchSearchTopStories(searchTerm, page = 0) {
      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
         .then(result => this._isMounted && this.setSearchTopStories(result.data))
         .catch(error => this._isMounted && this.setState({ error }));
   }

   onDismiss(id) {
      const { searchKey, results } = this.state;
      const { hits, page } = results[searchKey];
      const isNotId = item => {
         return item.objectID !== id;
      };
      const updatedHits = hits.filter(isNotId);
      this.setState({ results: { ...results, [searchKey]: { hits: updatedHits, page } } });
   }

   onSearchChange(evt) {
      this.setState({ searchTerm: evt.target.value });
   }

   onSearchSubmit(evt) {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });

      if (this.needsToSearchTopStories(searchTerm)) {
         this.fetchSearchTopStories(searchTerm);
      }
      evt.preventDefault();
   }

   setSearchTopStories(result) {
      const { hits, page } = result;

      this.setState(prevState => {
         const { searchKey, results } = prevState;
         const oldHits = (results && results[searchKey])
            ? results[searchKey].hits
            : [];
         const updatedHits = [...oldHits, ...hits];
         return{
            results: {
               ...results,
               [searchKey]: { hits: updatedHits, page }
            }
         };
      });
   }

   componentDidMount() {
      this._isMounted = true;
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchSearchTopStories(searchTerm);
   }

   componentWillUnmount() {
      this._isMounted = false;
   }

   //alternate version of onDismiss that doesn't use bind in constructor
   /*
   onDismiss = (id) => {
      const updatedList = this.state.list.filter(item => { return item.objectID !== id });
      this.setState({ list: updatedList });
   }
   */

   render() {
      const { searchTerm, results, searchKey, error, sortKey } = this.state;
      const page = (results && results[searchKey] && results[searchKey].page) || 0;
      const list = (results && results[searchKey] && results[searchKey].hits) || [];
      if (error) {
         return <p>Something went wrong.</p>;
      }
      return (
         <div className="page">
            <div className="interactions">
               <Search
                  value={searchTerm}
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}
                  sortKey={sortKey}
                  onSort={this.onSort}
               >Search</Search>
            </div>
            {
               //TODO: figure out how to do more full-fledged conditional rendering
               list.length > 0
                  ? <Table list={list} onDismiss={this.onDismiss} />
                  : <Loading />
            }
            <div className="interactions">
               <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
            </div>
         </div>
      );
   }
}

class Loading extends Component {
   render() {
      return (
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

class Search extends Component {
   componentDidMount() {
      if (this.input) {
         this.input.focus();
      }
   }
   render() {
      const { value, onChange, onSubmit, children } = this.props;
      return (
         <form onSubmit={onSubmit}>
            <input
               type="text"
               value={value}
               onChange={onChange}
               ref={(node) => { this.input = node; }}
            />
            <button type="submit">{children}</button>
         </form>
      );
   }
}

class Table extends Component {
   constructor(props) {
      super(props);
      this.state = {
         sortKey: 'NONE',
         isSortReverse: false
      };

      this.onSort = this.onSort.bind(this);
   }

   onSort(sortKey) {
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({ sortKey, isSortReverse });
   }

   render() {
      const { list, onDismiss } = this.props;
      const { sortKey, isSortReverse } = this.state;
      const largeColumn = {
         width: '40%',
      };
      const midColumn = {
         width: '30%',
      };
      const smallColumn = {
         width: '10%',
      };
      const sortedList = SORTS[sortKey](list);
      const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
      return (
         <div className="table">
            <div className="table-header">
               <span style={{ width: '40%' }}><Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>Title</Sort></span>
               <span style={{ width: '30%' }}><Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>Author</Sort></span>
               <span style={{ width: '10%' }}><Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>Comments</Sort></span>
               <span style={{ width: '10%' }}><Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>Points</Sort></span>
               <span style={{ width: '10%' }}>Archive</span>
            </div>
            {reverseSortedList.map(item =>
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

const Sort = ({ sortKey, onSort, children, activeSortKey }) => {
   const sortClass = ['button-inline'];
   if (sortKey === activeSortKey) {
      sortClass.push('button-active');
   }
   return (
      <Button className={sortClass.join(' ')} onClick={() => onSort(sortKey)}>{children}</Button>
   );

}

export default App;
export { Button, Search, Table };