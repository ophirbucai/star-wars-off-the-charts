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

  useEffect(() => {
    getPlanetsData()
  }, [])

  const getVehiclesData = async() => {
    const urls = [
      "https://swapi.dev/api/vehicles/",
      "https://swapi.dev/api/vehicles/?page=2",
      "https://swapi.dev/api/vehicles/?page=3",
      "https://swapi.dev/api/vehicles/?page=4"
    ];

    try {
      let res = await Promise.all(urls.map((e) => fetch(e)));
      let json = await Promise.all(res.map((e) => e.json()));
      const vehiclesArray = [].concat.apply([], json.map((e) => e.results));
      await consolidate(vehiclesArray, 'pilots');
      await Promise.all(vehiclesArray.map(async (vehicle) => await consolidate(vehicle.pilots, 'homeworld')));
      setVehicles(vehiclesArray);
    } catch (error) {
      console.log(error);
    }
  };

  const consolidate = async (array, key) => {
    try {
      const newArray = array.map(async (urls) => { // array may contain a string url or an array of urls
        if (typeof urls[key] == 'string') {
          const res = await fetch(urls[key]);
          const fetchedData = await res.json();
          urls[key] = fetchedData; // replace the string url with the fetched data
        } else {
          if(!urls?.[key].length) return; // check if the array is empty, if so return;
          const fetchedData = await Promise.all(urls[key].map(async (e) => {
            const res = await fetch(e);
            return await res.json();
          }));
          urls[key] = fetchedData; // replace the array of urls with fetched data array
          return urls;
        }
      });
      return await Promise.all(newArray).then((data) => data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  useEffect(() => {
    getVehiclesData();
  }, []);

  const findPopulationSum = () => {
    const map = {};
    vehicles.forEach((vehicle, index) => {
      const sum = vehicle.pilots.reduce((acc, pilot) => {
        return acc + parseInt(pilot.homeworld.population) || 0; // if population is not a number, add 0
      }, 0);
      map[index] = sum;
    })
    console.log(map);
    return map;
  }

  const findMostPopulated = (map) => {
    const mostPop = Object.keys(map).reduce((acc, index) => {
      if (map[index] > acc.population) {
        return {index, population: map[index]};
      } else {
        return acc;
      }
    }, {population: 0});
    return vehicles[mostPop.index];
  }

  const mostPopulated = useMemo(() => {
    const populationMap = findPopulationSum();
    return findMostPopulated(populationMap);
  }, [vehicles])



  return (
    <div className="App">
      {planets && <BarChart details={planets} />}
      {mostPopulated && <TableChart details={mostPopulated} />}
    </div>
  );
}

export default App;
