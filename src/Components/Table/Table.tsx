import React, { useState, FC, useRef } from 'react';
import {useTable, Column} from "react-table"
import { TDWrapper, THWrapper, THeadWrapper, TableWrapper } from './Table.styled';
import Yahtzee from '../../Services/API';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip, Popover, Overlay } from 'react-bootstrap';

interface TableProps {
    columns: Column[]
    data: Row[]
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


  // for error popups
  const [errorMessage, setErrorMessage] = useState<string>("");
  const target = useRef(null);

  const renderTooltip = (col: number) => (
    <Tooltip {...props} style={{'color': 'white', 'fontSize': '60px'}}>
      {col === 1 ? props.yahtzee.gameState.player1 : col === 2 ? props.yahtzee.gameState.player2 : ""}
    </Tooltip>
  )

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );

  return (
    <TableWrapper {...getTableProps()}>
      <THeadWrapper>
        {
          headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map( (column, i) => (
                    <OverlayTrigger overlay={renderTooltip(i)} placement='top'>
                      <THWrapper 
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
                      <Overlay target={target.current} show={errorMessage === ""}>
                        {popover}
                      </Overlay>
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
    let myCol = 0;
    if (props.yahtzee.currentAccount == props.yahtzee.gameState.player1) myCol = 1;
    if (props.yahtzee.currentAccount == props.yahtzee.gameState.player2) myCol = 2;
    
    if (cellind == myCol) {
      props.yahtzee.bankRoll(rowind).then(result => {
        console.log(result)
      }).catch(err => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
        console.log(err)
      });
    }
  }
}

export default Table;