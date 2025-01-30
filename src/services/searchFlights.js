import { searchAirport } from "./searchAirport";
import axios from 'axios';

const searchFlights = async (originSkyId, destinationSkyId, originEntityId,destinationEntityId,date,returnDate,cabinClass,adults,sortBy) => {
    const params= {
        originSkyId,
        destinationSkyId,
        originEntityId, 
        destinationEntityId, 
        date,
        cabinClass,
        adults,
        sortBy,
        currency: 'USD',
        market: 'en-US',
      };
      if (returnDate) {
        params.returnDate = returnDate;
      }
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
    params,
    headers: {
        'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      },
  };

  try {
    const response = await axios.request(options);
    console.log(response);

    if (response.data.status && response.data.data && response.data.data.itineraries) {
      return response.data.data.itineraries; // Return the itineraries
    } else {
      throw new Error('No flights found.');
    }
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

export const getAllFlights = async (originCity, destinationCity, date, returnDate,cabinClass,adults,sortBy) => {
  const originAirports = await searchAirport(originCity); 
  const destinationAirports = await searchAirport(destinationCity); 
  const uniqueOrigins = [...new Map(originAirports.map(a => [a.skyId, a])).values()];
  const uniqueDestinations = [...new Map(destinationAirports.map(a => [a.skyId, a])).values()];


  const requestedRoutes = new Set(); // Track unique API requests
  const flights = []; // Store flight data
  
  for (const origin of uniqueOrigins) {
    for (const destination of uniqueDestinations) {
      // Create a unique key for this request
      const routeKey = `${origin.skyId}-${destination.skyId}-${date}-${returnDate}-${cabinClass}-${adults}-${sortBy}`;
  
      // If the route has already been requested, skip it
      if (requestedRoutes.has(routeKey)) {
        console.log(`Skipping duplicate request for ${origin.name} to ${destination.name}`);
        continue;
      }
  
      // Add the route to the set before making the API call
      requestedRoutes.add(routeKey);
  
      try {
        // Fetch flights for this unique origin-destination-date pair
        const itineraries = await searchFlights(origin.skyId, destination.skyId, origin.entityId, destination.entityId, date, returnDate, cabinClass, adults, sortBy);
        console.log(itineraries);
  
        // Directly add all fetched itineraries (no need to check for duplicates)
        flights.push(...itineraries.filter(flight => 
            !flights.some(existingFlight => existingFlight.id === flight.id)
          ));
                  
  
      } catch (error) {
        console.log(`Error fetching flights for ${origin.name} to ${destination.name}`);
      }
    }
  }
  
  console.log("flights ", flights)
  return flights;
};

