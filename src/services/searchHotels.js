import axios from 'axios';
const searchDestination= async (destinationName)=>{
    const params= {
        query:destinationName,
      };

  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel',
    params,
    headers: {
        'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      },
  };

  try {
    const response = await axios.request(options);
        console.log("Full API Response:", response.data); 

        if (!response.data || !response.data.data) {
            throw new Error("Unexpected response structure.");
        }
     
      const hotels = response.data.data
            .map((data) => ({
                name: data.entityName,
                entityId: data.entityId,
                location: data.location,
                state: data.hierarchy,
                entityType: data.entityType,
            }));
    return hotels;
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    throw error;
  }
}
export const searchHotels=async (destinationName,checkIn,checkOut,adults,rooms)=>{
    try {
        const destinations = await searchDestination(destinationName);
    
        if (destinations.length === 0) {
          throw new Error("No destinations found.");
        }

        const selectedDestination = destinations[0]; //select only one to reduce api calls, with more availability would call for each and display entity name (City/region)
        const entityId = selectedDestination.entityId;
    
        const params = {
          entityId,
          checkin: checkIn,
          checkout: checkOut,
          adults,
          rooms,
        };
    
        const options = {
          method: 'GET',
          url: 'https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchHotels',
          params,
          headers: {
            'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
          },
        };
    
        const response = await axios.request(options);
        console.log(response)
        if (!response || !response.data || !response.data.data.hotels || response.data.data.hotels.length === 0) {
          throw new Error("No hotels found for the selected destination and dates.");
        }
    
        return response.data.data.hotels;
      } catch (error) {
        console.error("Error searching hotels:", error);
        throw error;
      }
}