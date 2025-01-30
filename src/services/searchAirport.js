
import axios from 'axios';

export async function searchAirport(cityName) {
  const url = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport';

  try {
    const response = await axios.get(url, {
      params:{
        query: cityName, 
        locale: 'en-US', 
      }, 
      headers: {
        'x-rapidapi-key': 'ENTER YOUR API KEY HERE',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      },
    });
    console.log(response);
    const data = response.data;
    
    if (!data || !data.data || data.data.length === 0) {
      throw new Error("No airports found for this location");
    }
    console.log(data.data);
    
    const airports = data.data.map(item => ({
      name: item.navigation.relevantFlightParams.localizedName,
      skyId: item.navigation.relevantFlightParams.skyId,
      entityId: item.navigation.relevantFlightParams.entityId,
    }));
    console.log(airports);
    return airports;
  } catch (error) {
    console.error("Error fetching airport data:", error);
    throw error;
  }
}
