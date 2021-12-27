import React, { useMemo } from 'react';
import styled from "styled-components";

const BarContainer = styled.div`
  
  padding: 50px 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 60vh;
  
`

const Bar = styled.div`
    background: lightgreen;
    height: ${props => props.height}%;
    width: 120px;
    height: ${props => props.height}%;
    position: relative;
    animation: fill-from-bottom;
    animation-fill-mode: backwards;
    animation-timing-function: cubic-bezier(.35,.80,.65,.95);
    animation-delay: ${props => props.i * 260}ms;
    animation-duration: 1000ms;
    &:after, &:before {
      position: absolute;
      color: #eee;
      right: 0;
      left: 0;
      text-align: center;
    }
    &:after {
      content: "${props => props.population}";
      top: -30px;
    }
    &:before {
      content: "${props => props.label}";
      bottom: -30px;
    }
    @keyframes fill-from-bottom {
      0% {
        height: 0;
      }
      100% {
        visibility: visible;
        
      }
    }
  
`

function BarChart({ details }) {
    const barHeights = useMemo(() => {
        const getRootedNumber = (num) => {
            return Math.floor(Math.sqrt(Math.sqrt(Math.sqrt(num))));
        }
        const getBarHeights = () => {
            const largestPopulation = details.reduce((acc, planet) => {
                return Number(planet.population) > acc.population ? planet : acc
            }, {population: 0});
            const sqRootedLargestPopulation = getRootedNumber(largestPopulation.population);
            return details.map((planet) => getRootedNumber(planet.population) / sqRootedLargestPopulation * 100);
        }
        const calculatedBarHeights = getBarHeights();
        return calculatedBarHeights;
    }, [details])

    return (
        <BarContainer>
            {details.map((planet, i) => <Bar height={barHeights[i]} population={planet.population} label={planet.name} i={i} key={i} />)}
        </BarContainer>
    );
}

export default BarChart;