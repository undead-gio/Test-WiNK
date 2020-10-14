import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

function ModalBook(props) {
  const [book, setBook] = useState(false); //book detail information from list


  useEffect(() => {
    setBook(props.book); //set book onChange of props
  }, [props])

  // check photo exist, else set default
  function photo() {
    //check if exist data imageLinks
    if(book.volumeInfo.imageLinks){
      //check if thumbnail is not undefined
      if(book.volumeInfo.imageLinks.thumbnail !== undefined){
        return book.volumeInfo.imageLinks.thumbnail
      }
    } else return '/img/No-Photo-Available.jpg'
  }

  // check description exist, else set default
  function description() {
    //check if not exist data description
    if(!book.volumeInfo.description){
      //return default description
      return 'No description available for this book, contact API administrator to add one :)'
    } else return book.volumeInfo.description
  }

  if(book !== false){
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">

          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid className="no-pad">
            <Row>
              <Col xs={12} md={5}>
                <Image src={photo()} className="img-modal d-flex justify-content-center"/>
              </Col>
              <Col xs={12} md={7}>
                <div className="infoBook">
                  <h2>{book.volumeInfo.title}</h2>
                  <h5 className="h5-info">{book.volumeInfo.authors} · {book.volumeInfo.publishedDate}</h5>
                  <p className="p-info">{description()}</p>
                  <Button variant="primary" onClick={() => window.open(book.volumeInfo.infoLink, "_blank")}> infoLink </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  } else {
    return null
  }
}

export default ModalBook;
