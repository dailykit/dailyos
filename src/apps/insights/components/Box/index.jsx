import React from 'react'
import styled from 'styled-components'

export const Box = ({ children, style }) => {
   return <StyledBox style={style}>{children}</StyledBox>
}

const StyledBox = styled.div`
   background: #ffffff;
   border-radius: 10px;
   padding: 20px;
`
