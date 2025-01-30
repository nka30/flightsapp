import axios from 'axios';
const searchLocation= async (destinationName)=>{
    const params= {
        query:destinationName,
      };

  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/cars/searchLocation',
    params,
    headers: {
        'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      },
  };

  try {
    const response = await axios.request(options);
    console.log("first response",response)
        if (!response.data||!response.data.data) {
            throw new Error("Unexpected response structure.");
        }
     
        const locations = response.data.data.map((data) => ({
            entityId: data.entity_id,
        }));
    console.log(locations);
    return locations;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
}
export const searchCars=async (destinationName,pickupDate,pickupTime)=>{
    try {
        const locations = await searchLocation(destinationName);
    
        if (locations.length === 0) {
          throw new Error("No location found.");
        }

        const entityId = locations[0].entityId;
        
        const params = {
            pickUpEntityId: entityId,
            pickUpDate: pickupDate,
            pickUpTime:pickupTime,
        }
    
        const options = {
          method: 'GET',
          url: 'https://sky-scrapper.p.rapidapi.com/api/v1/cars/searchCars',
          params,
          headers: {
             'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
             'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
          },
        };
    
        const response = await axios.request(options);
        console.log("cars response",response)
        if (!response || !response.data || !response.data.data.quotes || response.data.data.quotes.length === 0) {
            throw new Error("No cars found for the selected destination and time.");
        }

        return processCarRentals(response.data.data);

    } catch (error) {
        console.error("Error searching cars:", error);
        throw error;
    }
};

const processCarRentals = (data) => {
    if (!data || !data.quotes || data.quotes.length === 0) {
        console.error("Invalid API response");
        return [];
    }

    const rentals = [];
    data.quotes.forEach((quote) => {
        const groupKey = quote.group;  
        const group = data.groups[groupKey];  
        
        if (group) {
            rentals.push({
                vendor: quote.vndr || "Unknown", 
                score: quote.vndr_rating.overall_rating || "N/A", 
                carName: group.car_name || "Unknown", 
                maxSeats: group.max_seats || "N/A", 
                maxBags: group.max_bags || "N/A", 
                meanPrice: group.mean_price ? `$${group.mean_price.toFixed(2)}` : "N/A", 
                pickuptype: quote.pickup_type || "Unknown", 
                bookingLink: quote.dplnk ? `https://www.skyscanner.net${quote.dplnk}` : "N/A", 
            });
        }
    });
    console.log("rentals:", rentals)
    return rentals;
};

