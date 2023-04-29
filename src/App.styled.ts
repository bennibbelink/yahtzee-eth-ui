import styled from 'styled-components'


export const StyledForm = styled.form`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 5px;
  width: 30%;
`

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: dimgray;
  // border: solid red 1px;
  margin:5%
`

export const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
  &[type=checkbox] {
    transform: scale(1);
    background-color: palevioletred;
  }
`

export const StyledButton = styled.button`
  background-color: palevioletred;
  color: white;
  padding: 10px;
  // margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
  width: 30%;


// export const Form = styled.form`
//     margin: auto;
//     border: solid white;
//     display: flex;
//     // flex-wrap: wrap;
//     flex-direction: column;
//     align-items: space-between;
//     justify-content: space-between;

//     width: 40%;
//   `

// export const Label = styled.label`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
// `

// export const Input = styled.input`
//     &[type=text]:focus {
//       background-color: lightblue;
//     }
//     &[type=checkbox] {
//       transform: scale(2)
//     }
//     // width: 50%;
//     // margin: auto;
//     padding: 10px;
    
//     &[type=text] {

//     }
//   `