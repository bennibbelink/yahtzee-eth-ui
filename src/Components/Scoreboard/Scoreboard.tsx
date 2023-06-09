import React, { FC } from 'react';
import { ScoreboardWrapper } from './Scoreboard.styled';
import {Column, Accessor} from 'react-table'
import {State} from '../../Types'
import Table from '../Table/Table'
import Yahtzee from '../../Services/API';
import truncateEthAddress from 'truncate-eth-address'

interface ScoreboardProps {
   yahtzee: Yahtzee
}

const Scoreboard: FC<ScoreboardProps> = (props: ScoreboardProps) => {

   // 15 categories: 13 + bonus and total
   let categories: string[] = [
      'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Bonus',
      '3 of a kind', '4 of a kind', 'Full house', 'SM straight', 'LG straight',
      'Yahtzee', 'Chance', 'Total'
   ];

   let data = Array(15);
   for (let i = 0; i < categories.length; i++) {
      data[i] = {
         'category': categories[i], 
         'player1':  props.yahtzee.gameState.player1_scores[i] == -1 ? (i == 6 ? `${props.yahtzee.gameState.player1_scores.slice(0, 6).reduce((partialSum, a) => {
            if (a >= 0)
               return partialSum + a
            else return partialSum;
         }, 0)} / 63` : i == 14 ? props.yahtzee.gameState.player1_scores.slice(0, 14).reduce((partialSum, a) => {
            if (a >= 0)
               return partialSum + a
            else return partialSum;
         }, 0) : 0) : props.yahtzee.gameState.player1_scores[i],
         'player2': props.yahtzee.gameState.player2_scores[i] == -1 ? (i == 6 ? `${props.yahtzee.gameState.player2_scores.slice(0, 6).reduce((partialSum, a) => {
            if (a >= 0)
               return partialSum + a
            else return partialSum;
         }, 0)} / 63` : i == 14 ? props.yahtzee.gameState.player2_scores.slice(0, 14).reduce((partialSum, a) => {
            if (a >= 0)
               return partialSum + a
            else return partialSum;
         }, 0) :0) : props.yahtzee.gameState.player2_scores[i]
      }
   }
   let columns: Column[] = [
      { Header: 'Category', accessor: 'category' },
      { Header: `${truncateEthAddress(props.yahtzee.gameState.player1)}`, accessor: 'player1' },
      { Header: `${truncateEthAddress(props.yahtzee.gameState.player2)}`, accessor: 'player2' }
   ];


   return (

      <ScoreboardWrapper>
         <Table yahtzee={props.yahtzee} columns={columns} data={data}/>
      </ScoreboardWrapper>
   );

   }

export default Scoreboard;
