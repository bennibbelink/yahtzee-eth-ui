import React, { useState, FC } from 'react';
import {useTable, Column} from "react-table"
import { TDWrapper, THWrapper, THeadWrapper, TableWrapper } from './Table.styled';
import Yahtzee from '../../Services/API';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from 'react-bootstrap';

interface TableProps {
    columns: Column[]
    data: Row[]
    selected: boolean[]
    yahtzee: Yahtzee
}

interface HeaderProps {
  value: string
}

interface Row {
    category: string
    player1: number | null
    player2: number | null
}

const Table: FC<TableProps> = (props: TableProps) => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns: props.columns, data: props.data});

  
  const [showP1, setShowP1] = useState<boolean>(false);
  const [showP2, setShowP2] = useState<boolean>(false);

  const renderTooltip = (col: number) => (
    <Tooltip {...props} style={{'color': 'white', 'fontSize': '60px'}}>
      {col === 1 ? props.yahtzee.gameState.player1 : col === 2 ? props.yahtzee.gameState.player2 : ""}
    </Tooltip>
  )

  return (
    <TableWrapper {...getTableProps()}>
      <THeadWrapper>
        {
          headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map( (column, i) => (
                    <OverlayTrigger overlay={renderTooltip(i)} placement='top'>
                      <THWrapper onMouseEnter={() => {i === 1 ? setShowP1(true) : i === 2 && setShowP2(true)}}
                                onMouseLeave={() => {i === 1 ? setShowP1(false) : i === 2 && setShowP2(false)}}
                      {...column.getHeaderProps()} style={
                      (props.yahtzee.currentAccount === props.yahtzee.gameState.player1 && 1 === i) || 
                      (props.yahtzee.currentAccount === props.yahtzee.gameState.player2 && 2 === i)
                      ? {color : 'white'} : {color: 'gray'}
                        }>
                          {column.render('Header')}
                          <p>{(props.yahtzee.gameState.turn === props.yahtzee.gameState.player1 && 1 === i) || 
                      (props.yahtzee.gameState.turn === props.yahtzee.gameState.player2 && 2 === i) ? "*" : ""}</p>
                      </THWrapper>
                    </OverlayTrigger>
                  ))
                }
              </tr>
          ))
        }
      </THeadWrapper>
      <tbody {...getTableBodyProps()}>
        { // loop over the rows
          rows.map((row, rowind) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                { // loop over the rows cells 
                  row.cells.map((cell, cellind) => (
                    <TDWrapper style={usedCat(rowind, cellind) ? {color : 'white'} : {color: 'gray'}} onClick={() => onclick(rowind, cellind)} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TDWrapper>
                  ))
                }
              </tr> 
            )
          })
        }
        <tr>
          <td></td>
        </tr>
      </tbody>
    </TableWrapper>
  );

  function usedCat(category: number, player: number): boolean {
    if (player === 1) {
      return props.yahtzee.gameState.player1_scores[category] >= 0;
    } else if (player === 2) {
      return props.yahtzee.gameState.player2_scores[category] >= 0;
    } else {
      return false;
    }
  }

  async function onclick(rowind: number, cellind: number) {
    if (cellind > 0) {
      props.yahtzee.bankRoll(rowind).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      });
    }
  }
}

export default Table;