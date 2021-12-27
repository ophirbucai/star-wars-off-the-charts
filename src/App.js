import { useEffect, useMemo, useState } from 'react';
import './App.css';
import TableChart from "./components/TableChart/TableChart";
import BarChart from "./components/BarChart/BarChart";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [planets, setPlanets] = useState([]);

  const getPlanetsData = async() => {
    const planets = ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"];
    let res = await Promise.all(planets.map((planet) => fetch("https://swapi.dev/api/planets/?search=" + planet)));
    let json = await Promise.all(res.map((e) => e.json()));
    let planetsArray = json.map((e) => e.results[0]);
    setPlanets(planetsArray);
  }

  const getVehiclesData = async() => {
    const urls = [
      "https://swapi.dev/api/vehicles/",
      "https://swapi.dev/api/vehicles/?page=2",
      "https://swapi.dev/api/vehicles/?page=3",
      "https://swapi.dev/api/vehicles/?page=4"
    ];

    try {
      const fetchData = async (url) => {
        const res = await fetch(url);
        return await res.json();
      }
      const arrayToBeMerged = await Promise.all(urls.map((url) => fetchData(url)));
      const vehiclesArray = [].concat.apply([], arrayToBeMerged);
      vehiclesArray.map(async (vehicle) => {
        if (!vehicle.pilots?.length) {
          return;
        }
        const pilots = await Promise.all(vehicle.pilots.map(async (url) => {
          const data = await fetchData(url);
          data.homeworld = await fetchData(data.results.homeworld);
          return data;
        }));
        vehicle.pilots = pilots;
      })
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  useEffect(() => {
    getPlanetsData()
    getVehiclesData();
  }, []);


  return (
    <div className="App">
      {planets && <BarChart planets={planets} />}
      {vehicles && <TableChart vehicles={vehicles} />}
    </div>
  );
}

export default App;
