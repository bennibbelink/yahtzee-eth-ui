import styled, {keyframes} from 'styled-components';
import { tada } from 'react-animations';

const rollAnimation = keyframes`${tada}`

export const DiceWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const RollingDieWrapper = styled.div`
    animation: 0.75s ${rollAnimation};
    padding: 5px;
    margin: 5px;
`;

export const DieWrapper = styled.div`
    padding: 5px;
    margin: 5px;
`;