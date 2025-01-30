import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
export default function Navigation(){
    return(
    <Navbar bg="dark" data-bs-theme="dark" >
        <Container>
          <Navbar.Brand href="/">Flight-Finder</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/flights">Flights</Nav.Link>
            <Nav.Link as={Link} to="/hotels">Hotels</Nav.Link>
            <Nav.Link as={Link} to="/cars">Cars</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
}