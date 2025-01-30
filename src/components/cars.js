import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { searchCars } from '../services/searchCars'; // Adjust the import path accordingly
import React, { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

function CarSearchForm() {
  const [destination, setDestination] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setCars([]);
    setIsLoading(true);
    try {
      const carsData = await searchCars(destination, pickupDate, pickupTime);
      setCars(carsData);
      console.log("Cars data: ", carsData);
    } catch (error) {
      setErrorMessage('An error occurred while searching for cars.');
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
              onChange={(e) => setDestination(e.target.value)}
              className="p-2" 
            />
          </Col>

          <Col sm={2} className="my-1">
            <Form.Label htmlFor="pickupDate" className="block">Pickup Date</Form.Label>
            <Form.Control 
              id="pickupDate" 
              type="date" 
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="p-2" 
            />
          </Col>

          <Col sm={2} className="my-1">
            <Form.Label htmlFor="pickupTime" className="block">Pickup Time</Form.Label>
            <Form.Control 
              id="pickupTime" 
              type="time" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="p-2" 
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
          <span className="ml-2">Loading cars...</span>
        </div>
      )}

      {/* Display error message if there's any */}
      {errorMessage && <div className="text-black-500">{errorMessage}</div>}

      {cars.length > 0 && (
        <div className="mt-4">
          <h3>Cars found:</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Car Name</th>
                <th>Rating</th>
                <th>Seats</th>
                <th>Bags</th>
                <th>Price</th>
                <th>Pickup type</th>
                <th>Booking Link</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index}>
                  <td>{car.vendor}</td>
                  <td>{car.carName}</td>
                  <td>{car.score}</td>
                  <td>{car.maxSeats}</td>
                  <td>{car.maxBags}</td>
                  <td>{car.meanPrice}</td>
                  <td>{car.pickuptype}</td>
                  <td>
                    <a 
                      href={car.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Now
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

export default CarSearchForm;
