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
      const promises = vehiclesArray.map(async (vehicle) => {
        return await consolidate(vehicle.pilots, 'homeworld')
      });
      await Promise.all(promises);
      setVehicles(vehiclesArray);
    } catch (error) {
      console.log(error);
    }
  };

  const consolidate = async (array, key) => {
    try {
      const newArray = array.map(async (item) => {
        if (typeof item[key] == 'string') {
          const res = await fetch(item[key]);
          const json = await res.json();
          item[key] = json;
          return;
        } else {
          if(!item?.[key]?.length) return item;
          let res = item[key].map(async (e) => {
            const response = await fetch(e);
            const json = await response.json();
            return json;
          });
          const items4Key = await Promise.all(res);
          item[key]= items4Key;
          return item;
        }
      });
      const toRet = await Promise.all(newArray).then((data) => data);
      return toRet;
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
