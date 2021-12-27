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

function TableChart({ details }) {
    const homePlanets = useMemo(() => {
        return (
            <Cell>{details.pilots.map((pilot, i) => <span key={i}>{pilot.homeworld.name + " " + pilot.homeworld.population}</span>)}</Cell>
        )
    }, [details])
    const pilotNames = useMemo(() => {
        return (
            <Cell>{details.pilots.map((pilot, i, pilots) => <span key={i}>{pilot.name + (i === pilots.length - 1 ? "" : ", ")}</span>)}</Cell>
        )
    })

    return (
        <Table>
            <tbody>
                <Row>
                    <Header>Vehicle name with the largest sum</Header>
                    <Cell>{details.name}</Cell>
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
    );
}

export default TableChart;