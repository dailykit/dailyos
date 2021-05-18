import styled, { css } from 'styled-components'

export const StyledCardEven = styled.div(
  ({ index }) => css`
  height: 80px;
  width: 140px;
  padding: 5px 5px 5px 5px;
  background: ${index % 2 == 0
      ? `#FFFFFF`
      : `#F4F4F4`};
  border: 1px solid #F4F4F4;
  box-sizing: border-box;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 26px;
  letter-spacing: 0.32px;
  display: inline-block;
`
)


export const Heading = styled.div`
  padding: 12px 16px 80px 16px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  letter-spacing: 0.32px;
  color: #202020;
`;

export const StyledCardIngredient = styled.div(
  () => css`
  width: 226px;
  height: 130px;
  background: #FFFFFF;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 16px;
  padding: 19px 5px 13px 0px;
  display: inline-block;
  
`
)

export const SatchetCard = styled.div(
  ({ index }) => css`
  height: 57px;
  width: 140px;
  padding: 5px 5px 5px 5px;
  background: ${index % 2 == 0
      ? `#FFFFFF`
      : `#F4F4F4`};
  border: 1px solid #F4F4F4;
  box-sizing: border-box;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 26px;
  letter-spacing: 0.32px;
  display: inline-block;
  
`
) 