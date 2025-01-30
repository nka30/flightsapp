import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { searchHotels } from '../services/searchHotels';
import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

function HotelSearchForm() {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setHotels([]);
    setIsLoading(true);
    try {
      const hotelsData = await searchHotels(destination, checkInDate, checkOutDate, numAdults, numRooms);
      setHotels(hotelsData);
      console.log("Hotels data: ", hotelsData);
    } catch (error) {
      setErrorMessage('An error occurred while searching for hotels.');
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <div className="flex justify-center p-4">
      <Form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
        <Row className="justify-content-center align-items-center">
     
        <Col sm={3} className="my-1">
          <Form.Label htmlFor="destination" className="block">Destination</Form.Label>
          <Form.Control 
          id="destination" 
          placeholder="Enter destination" 
          value={destination}
          onChange={(e)=>setDestination(e.target.value)}
          className="p-2" />
        </Col>
   
        <Col sm={2} className="my-1">
          <Form.Label htmlFor="checkInDate" className="block">Check-in Date</Form.Label>
          <Form.Control 
          id="checkInDate" 
          type="date" 
          value={checkInDate}
          onChange={(e)=>setCheckInDate(e.target.value)}
          className="p-2" />
        </Col>

        <Col sm={2} className="my-1">
          <Form.Label htmlFor="checkOutDate" className="block">Check-out Date</Form.Label>
          <Form.Control 
          id="checkOutDate" 
          type="date" 
          value={checkOutDate}
          onChange={(e)=>setCheckOutDate(e.target.value)}
          className="p-2" />
        </Col>

        <Col sm={1} className="my-1">
          <Form.Label htmlFor="numAdults" className="block">Adults</Form.Label>
          <Form.Control 
            id="numAdults"
            type="number"
            value={numAdults}
            onChange={(e) => setNumAdults(e.target.value)}
            min="1"
            step="1"
            aria-label="Number of Adults"
            className="text-center p-2"
          />
        </Col>

        <Col sm={1} className="my-1">
          <Form.Label htmlFor="numRooms" className="block">Rooms</Form.Label>
          <Form.Control 
            id="numRooms"
            type="number"
            value={numRooms}
            onChange={(e) => setNumRooms(e.target.value)}
            min="1"
            step="1"
            aria-label="Number of Rooms"
            className="text-center p-2"
          />
        </Col>
        <Col xs="auto" className="my-1 mt-4">
          <Button type="submit" className="w-full py-2 bg-blue-500 text-white">Search</Button>
        </Col>
      </Row>

    </Form>
    {/* Loading Spinner */}
    {isLoading && (
        <div className="flex justify-center my-4">
          <Spinner animation="border" role="status" />
          <span className="ml-2">Loading hotels...</span>
        </div>
      )}

      {/* Display error message if there's any */}
      {errorMessage && <div className="text-black-500">{errorMessage}</div>}
      {hotels.length > 0 && (
        <div className="mt-4">
          <h3>Hotels found:</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Distance from Landmark</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Stars</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, index) => (
                <tr key={index}>
                  <td>{hotel.name}</td>
                  <td>{hotel.distance}</td>
                  <td>{hotel.price}</td>
                  <td>{hotel.rating.value}</td>
                  <td>{hotel.stars}</td>
                  <td>
                    <a 
                      href={`https://www.openstreetmap.org/?mlat=${hotel.coordinates[1]}&mlon=${hotel.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Map
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HotelSearchForm;
