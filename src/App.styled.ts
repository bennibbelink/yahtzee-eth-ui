import styled from 'styled-components'

export const Form = styled.form`
    margin: auto;
    border: solid white;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 50%;
  `

export const Input = styled.input`
    &[type=text]:focus {
      background-color: lightblue;
    }
    &[type=checkbox] {
      transform: scale(2)
    }
    width: 300px;
    margin: auto;
    padding: 10px;
    align: left;
    &[type=text] {

    }
  `