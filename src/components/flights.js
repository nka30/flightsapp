import React, { useState } from "react";
import { getAllFlights } from "../services/searchFlights";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const SearchFlights = () => {
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [cabinClass, setCabinClass] = useState("economy");
  const [adults, setAdults] = useState(1);
  const [sortBy, setSortBy] = useState("cheapest");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);

  const sortByOptions = [
    { label: "Best", value: "best" },
    { label: "Price High", value: "price_high" },
    { label: "Price Low", value: "price_low" },
    { label: "Fastest", value: "fastest" },
    { label: "Outbound Take-Off Time", value: "outbound_take_off_time" },
    { label: "Outbound Landing Time", value: "outbound_landing_time" },
    { label: "Return Take-Off Time", value: "return_take_off_time" },
    { label: "Return Landing Time", value: "return_landing_time" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const results = await getAllFlights(
        originCity,
        destinationCity,
        departureDate,
        tripType === "round-trip" ? returnDate : undefined,
        cabinClass,
        adults,
        sortBy
      );
      const sortedFlights = [...results].sort((a, b) => {
        switch (sortBy) {
          case "price_low":
            return parseFloat(a.price.raw) - parseFloat(b.price.raw);
          case "price_high":
            return parseFloat(b.price.raw) - parseFloat(a.price.raw);
          case "fastest":
            return a.legs[0].durationInMinutes - b.legs[0].durationInMinutes;
          case "outbound_take_off_time":
            return new Date(a.legs[0].departure) - new Date(b.legs[0].departure);
          case "outbound_landing_time":
            return new Date(a.legs[0].arrival) - new Date(b.legs[0].arrival);
          case "return_take_off_time":
            return new Date(a.legs[1]?.departure || 0) - new Date(b.legs[1]?.departure || 0);
          case "return_landing_time":
            return new Date(a.legs[1]?.arrival || 0) - new Date(b.legs[1]?.arrival || 0);
          case "best":
            return b.score - a.score; // Assuming 'score' determines the best flights
          default:
            return 0; // No sorting if no valid option is selected
        }
      });
  
      setFlights(sortedFlights);
      console.log("Sorted Flights:", sortedFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
      alert("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((expandedId) => expandedId !== id)
        : [...prevIds, id]
    );
  };

  return (
    <div className="p-4">
      <Form>
        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Origin City</Form.Label>
            <Form.Control
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="Enter origin city"
            />
          </Col>
          <Col sm={3}>
            <Form.Label>Destination City</Form.Label>
            <Form.Control
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="Enter destination city"
            />
          </Col>
          <Col sm={2}>
            <Form.Label>Cabin Class</Form.Label>
            <Form.Control
              as="select"
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </Form.Control>
          </Col>
          <Col sm={2}>
            <Form.Label>Adults</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />
          </Col>
          <Col sm={2}>
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Departure Date</Form.Label>
            <Form.Control
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </Col>
          {tripType === "round-trip" && (
            <Col sm={3}>
              <Form.Label>Return Date</Form.Label>
              <Form.Control
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Col>
          )}
          <Col sm={2}>
            <Form.Label>Trip Type</Form.Label>
            <Form.Control
              as="select"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="one-way">One-Way</option>
              <option value="round-trip">Round-Trip</option>
            </Form.Control>
          </Col>
          <Col xs="auto" className="my-1 mt-4">
            <Button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white"
                onClick={handleSearch} 
            >
                Search
            </Button>
            </Col>
        </Row>

        
            
            {loading &&(
            <div className="flex justify-center my-4">
                <Spinner animation="border" role="status" />
                
            </div>
            ) }


      </Form>

      {loading ? (
        <p>Loading flights...</p>
      ) : flights.length > 0 ? (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Airline</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Duration</th>
              <th>Stops</th>
              <th>Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((itinerary) => {
              const departureLeg = itinerary.legs[0];
              const returnLeg = itinerary.legs[1] || null;
              const airline =
                departureLeg?.carriers?.marketing?.[0]?.name ||
                departureLeg?.segments?.[0]?.operatingCarrier?.name ||
                "Unknown Airline";
              return (
                <React.Fragment key={itinerary.id}>
                  <tr>
                    <td>{airline}</td>
                    <td>{departureLeg.origin.name}</td>
                    <td>{departureLeg.destination.name}</td>
                    <td>
                      {`${Math.floor(departureLeg.durationInMinutes / 60)}h ${departureLeg.durationInMinutes % 60}m`}
                    </td>
                    <td>{departureLeg.stopCount}</td>
                    <td>{itinerary.price.formatted}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => toggleExpand(itinerary.id)}
                      >
                        {expandedIds.includes(itinerary.id)
                          ? "Collapse"
                          : "View Details"}
                      </Button>
                    </td>
                  </tr>
                  {/* Expanded Details */}
                  {expandedIds.includes(itinerary.id) && (
                    <tr>
                      <td colSpan="7">
                        <div>
                          <p>
                            <strong>Departure:</strong> {departureLeg.departure} from {departureLeg.origin.name} to {departureLeg.destination.name}
                          </p>
                          <p>
                            <strong>Flight Number:</strong> {departureLeg?.segments?.[0]?.flightNumber || "N/A"}
                          </p>
                          {returnLeg && (
                            <>
                              <p>
                                <strong>Return:</strong> {returnLeg.departure} from {returnLeg.origin.name} to {returnLeg.destination.name}
                              </p>
                              <p>
                                <strong>Return Flight Number:</strong> {returnLeg?.segments?.[0]?.flightNumber || "N/A"}
                              </p>
                            </>
                          )}
                          <p>
                            <strong>Changeable:</strong> {itinerary.farePolicy.isChangeAllowed ? "Yes" : "No"}
                          </p>
                          <p>
                            <strong>Stops:</strong> {departureLeg.stopCount}
                          </p>
                          <p>
                            <strong>Eco Score:</strong> {itinerary.eco ? itinerary.eco.ecoContenderDelta : "N/A"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        null
      )}
    </div>
  );
};

export default SearchFlights;
