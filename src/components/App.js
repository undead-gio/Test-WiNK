import React, { useEffect, useState } from 'react';
import List from './List';
import NavBar from './NavBar';
import '../App.css';

function App() {
  const [search, setSearch] = useState(''); //set state of search bar value

  //function callback for recive props from search bar
  function parentCallBack(dataChild) {
    setSearch(dataChild);
  }

  useEffect(() => {

  }, [search])

  return (
    <div>
      <NavBar parentCallBack = {parentCallBack}/>
      <div className="pad-list">
        <List searchValue = {search}/>
      </div>
    </div>
  );
}

export default App;
