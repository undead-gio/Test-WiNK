import React, { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import ModalBook from './ModalBook';
import Image from 'react-bootstrap/Image';

function List(props) {
  //set state
  const [errorMsg, setError] = useState(null); //error check
  const [isLoaded, setIsLoaded] = useState(false); //active load when the page is not ready
  const [items, setItems] = useState([]); //items of API call
  //const [numberPage, setNumberPage] = useState(0); //total number of page (don't work in this case beacause the API have logic prroblem)
  const [currentPage, setCurrentPage] = useState(1); //current page
  const [maxResult, setMaxResult] = useState(20); //number of max result to view in a page
  const [last, setLast] = useState(''); //check for last page
  const [modalShow, setModalShow] = useState(false); //open and close modal
  const [bookDetail, setBookDetail] = useState(false); //detail of book to show into modal
  const [search, setSearch] = useState(''); //search value from navbar component

  // call this function on change of currentPage, maxResult, props
  useEffect(() => {
    setIsLoaded(false);
    // if props is not empty do API call
    if (props.searchValue !== '') {
      apiCall();
      // if props is not same of search state, restart to page one
      if(props.searchValue !== search){
        setSearch(props.searchValue);
        setCurrentPage(1);
      }
    }
    window.scrollTo(0, 0); //scroll on top
    setError(false);
  }, [currentPage, maxResult, props])


  //fetch call
  function apiCall() {
    //set start index 0
    let startIndex = 0;
    //set index at 0 if is first page, else maxResult+1 (ES. maxResult=20, startIndex=21, necessary to not see the same result on the next page)
    (currentPage === 1) ? startIndex = (currentPage-1)*maxResult : startIndex = (currentPage-1)*maxResult + 1;
    let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${props.searchValue}&maxResults=${maxResult}&startIndex=${startIndex}`;
    fetch(apiUrl)
      .then(res => res.json())
      .then(
        (data) => {
          if(!data.error){
            setIsLoaded(true);
            if(data.items !== undefined) {
              setItems(data.items);
            } else {
              setCurrentPage(currentPage);
              setLast(data.items);
            }
            //setNumberPage(Math.ceil(data.totalItems/maxResult));
          }
          else {
            setError(data.error);
          }
        },
      )
      .catch(
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }

  //create pagination component
  function pagination() {
    let itemsPage = [];
    let pages;
    let disableLast = false;
    if(last===undefined){
      disableLast = true;
      pages = 1;
    } else {
      pages = 5;
      disableLast = false;
    }

    for(let n = currentPage; n<currentPage+pages; n++) {

      itemsPage.push(
        <Pagination.Item
          key={n}
          active={n === currentPage}
          onClick={() => setCurrentPage(n)}
        >
          {n}
        </Pagination.Item>
      );

    }

    const pagComp = (
      <Pagination>
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => {setCurrentPage(1); setLast('');}}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => {setCurrentPage(currentPage-1); setLast('');}}
        />
        {itemsPage}
        <Pagination.Next
          disabled={disableLast}
          onClick={() => setCurrentPage(currentPage+1)}
        />
      </Pagination>
    );
    return(pagComp)
  }

  //create dropdown component
  function dropdown() {
    let itemsDrop = [];
    //generate items drop multiple of 5, max until 20
    for(let n = 5; n<=20; n+=5){
      // push into a array items drop
      itemsDrop.push(
        <Dropdown.Item
          key={n}
          active={n === maxResult}
          onClick={() => setMaxResult(n)}
        >
          {n}
        </Dropdown.Item>
      )

    }
    return(
      <DropdownButton
        id="dropdown-basic-button"
        title=" elementi per pagina "
      >
        {itemsDrop}
      </DropdownButton>
    )
  }

  // Check if photo is charged, after check if exist a photo into json else set one default
  function photo(src) {
    if(src.volumeInfo.imageLinks){
      if(src.volumeInfo.imageLinks.thumbnail !== undefined){
        return src.volumeInfo.imageLinks.thumbnail
      }
    } else return '/img/No-Photo-Available.jpg'
  }

  // Check if exist a description into json else set one default
  function description(str) {
    if(!str){
      return 'No description available for this book, contact API administrator to add one :)'
    } else return str
  }

  //creare card component
  function cards(items) {
    let cards = [];

    //put into array all card component
    cards = items.map(item => (
      <Col key={item.etag} xs={12} md={6} lg={6} xl={4}>
        <div key={item.id} onClick={() => {setModalShow(true); setBookDetail(item);}} className="cardBook">
          <Container fluid className="cardCol">
            <Row>
              <Col xs={4} md={5}>
                <div>
                  <Image src={photo(item)} className="img-card"/>
                </div>
              </Col>
              <Col xs={8} md={7} className="col-textcard">
                <div>
                  <h3 className="truncate tit"> {item.volumeInfo.title} </h3>
                  <h5 className="truncate vol-info">{item.volumeInfo.authors}</h5>
                  <p className="truncate text"> {description(item.volumeInfo.description)} </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Col>
    ));

    return(
      <Container fluid className="card-group">
        <Row>
          {cards}
        </Row>
      </Container>
    )
  }

  //check error, isLoaded or show data
  if (errorMsg) {
    return (
      <Row>
        <Col xs={12} md={6}>
          <div className="align-self-center" style={{marginBottom: 50+'px'}}>Error: {errorMsg.message}</div>
        </Col>
        <Col xs={12} md={6}>
        <Image src="/img/undraw_server_down_s4lk.svg" fluid />
        </Col>
      </Row>
    )
  } else if (!isLoaded && props.searchValue !== '') { //when somethins load and props!= nulla mount spinner loader
    return (
      <div className="spinn">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )
  } else if (props.searchValue === '') { //if search props is empty, ex at lunch of application, show a start page
    return (
      <Row>
        <Col xs={12} md={5} className="align-self-center">
          <h1 className="h1-hero">Google <span className="span-hero">Books APIs</span></h1>
          <h4 className="h4-hero">Tramite le APIs di Google potrai cercare nel catalogo dei volumi forniti da Google il libro che hai sempre desiderato. </h4>
          <div className="p-hero">- Comincia a cercare libri tramite search bar...</div>
        </Col>
        <Col xs={12} md={7}>
        <Image src="/img/3081642.jpg" fluid />
        </Col>
      </Row>
    )
  } else { //else populate the page with content of API call
    return (
      <>
        <h4 className="browse">Browse</h4>
        {cards(items)}
        <div>
          <Row>
            <Col xs={12} className="d-flex justify-content-center">
              {pagination()}
            </Col>
            <Col xs={12} className="d-flex justify-content-center">
              {dropdown()}
            </Col>
          </Row>
        </div>

        <ModalBook
          show={modalShow}
          onHide={() => setModalShow(false)}
          book={bookDetail}
        />
      </>
    );
  }

}
export default List;
