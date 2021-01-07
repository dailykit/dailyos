import React from 'react'

import { Wrapper, StyledPopup, Text, ConfirmText, Actions } from './styles'

const Popup = ({ show, size, children }) => {
   return (
      <Wrapper show={show}>
         <StyledPopup size={size}>{children}</StyledPopup>
      </Wrapper>
   )
}

Popup.Text = ({ type, children }) => <Text type={type}>{children}</Text>

Popup.ConfirmText = ({ children }) => <ConfirmText>{children}</ConfirmText>

Popup.Actions = ({ children }) => <Actions>{children}</Actions>

export default Popup
