const Button = styled.button`
  ${ (props) => {
    return `
      background-color: ${props.theme['$btn-primary-bg']};
      color: ${props.theme['$btn-primary-color']};
    `
  }};`;

export {
  Button
}