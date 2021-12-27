import React, { useMemo } from 'react';
import styled from "styled-components";

const Table = styled.table`
  
      margin: 0 auto;
      height: 15vh;
      border-collapse: collapse;
      animation: fadeIn;
      animation-duration: 350ms;
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 100;
        }
      }
      
    `
const Row = styled.tr`
  
      background: lightgreen;
      text-align: left;
  
    `

const Header = styled.th`
    
    padding: 10px;
    border: 2px solid #282c34;

`

const Cell = styled.td`

    padding: 10px;
    border: 2px solid #282c34;

`

function TableChart({ vehicles }) {

    const findPopulationSum = () => {
        const map = {};
        vehicles.forEach((vehicle, index) => {
            const sum = vehicle.pilots.reduce((acc, pilot) => {
                return acc + parseInt(pilot.homeworld.population) || 0; // if population is not a number, add 0
            }, 0);
            map[index] = sum;
        })
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

    const homePlanets = useMemo(() => {
        return (
            <Cell>
                {mostPopulated?.pilots.map((pilot, i) => (
                    <span key={i}>{pilot.homeworld.name + " " + pilot.homeworld.population}</span>
                ))}
            </Cell>
        )
    }, [mostPopulated])

    const pilotNames = useMemo(() => {
        return (
            <Cell>
                {mostPopulated?.pilots.map((pilot, i, pilots) => (
                    <span key={i}>{pilot.name + (i === pilots.length - 1 ? "" : ", ")}</span>
                ))}
            </Cell>
        )
    }, [mostPopulated])

    return (
        <section>
            {mostPopulated &&
            <Table>
                <tbody>
                <Row>
                    <Header>Vehicle name with the largest sum</Header>
                    <Cell>{mostPopulated?.name}</Cell>
                </Row>
                <Row>
                    <Header>Related home planet</Header>
                    {homePlanets}
                </Row>
                <Row>
                    <Header>Related pilot names</Header>
                    {pilotNames}
                </Row>
                </tbody>
            </Table>
            }
        </section>
    );
}

export default TableChart;