import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

//props is search bar value
function NavBar(props) {

  //on change value of search bar, send as props the same
  function handleInputChange(event) {
    props.parentCallBack(event.target.value);
  }

  return (
    <>
    <Navbar fixed="top" className="nav">
      <h4 className="logo">BooK<span className="s-logo">S</span></h4>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar id="responsive-navbar-nav">
        <Form inline onSubmit={e => { e.preventDefault();}}>
          <FormControl type="text" placeholder="Cerca libri..." onChange={handleInputChange} className="search" />
        </Form>
      </Navbar>
    </Navbar>
    </>
  )
}
export default NavBar;
