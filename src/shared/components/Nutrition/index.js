import React from 'react'

import { Container, Grid, Row, Wrapper, Header, Rule, Major } from './styled'

const Nutrition = ({ data, vertical = false }) => {
   return (
      <Container>
         <Major>
            <h4>Calories</h4>
            <h3>220</h3>
         </Major>
         <Grid vertical={vertical}>
            <Wrapper>
               <Header>
                  <h6>Amount/Serving</h6>
                  <h6>% Daily Value</h6>
               </Header>
               <Rule />
               <Row>
                  <h5>
                     Total Fat <span>{data.totalFat}g</span>
                  </h5>
                  <h5>
                     {Math.round((parseInt(data.totalFat, 10) / 78) * 100)}%
                  </h5>
               </Row>
               <Row inset>
                  <span>
                     Saturated Fat <span>{data.saturatedFat}g</span>
                  </span>
                  <h5>
                     {Math.round((parseInt(data.saturatedFat, 10) / 20) * 100)}%
                  </h5>
               </Row>
               <Row inset>
                  <span>
                     Trans Fat <span>{data.transFat}g</span>
                  </span>
               </Row>
               <Row>
                  <h5>
                     Cholesterol <span>{data.cholesterol}mg</span>
                  </h5>
                  <h5>
                     {Math.round((parseInt(data.cholesterol, 10) / 300) * 100)}%
                  </h5>
               </Row>
               <Row>
                  <h5>
                     Sodium <span>{data.sodium}mg</span>
                  </h5>
                  <h5>
                     {Math.round((parseInt(data.sodium, 10) / 2300) * 100)}%
                  </h5>
               </Row>
               <Rule vertical={vertical} />
            </Wrapper>
            <Wrapper>
               <Header vertical={vertical}>
                  <h6>Amount/Serving</h6>
                  <h6>% Daily Value</h6>
               </Header>
               <Rule vertical={vertical} />
               <Row>
                  <h5>
                     Total Carbohydrate <span>{data.totalCarbohydrates}g</span>
                  </h5>
                  <h5>5%</h5>
               </Row>
               <Row inset>
                  <span>
                     Dietary Fiber <span>{data.dietaryFibre}g</span>
                  </span>
                  <h5>
                     {Math.round((parseInt(data.dietaryFibre, 10) / 28) * 100)}%
                  </h5>
               </Row>
               <Row inset>
                  <span>
                     Sugars <span>{data.sugars}g</span>
                  </span>
               </Row>
               <Row>
                  <h5>
                     Protein <span>{data.protein}g</span>
                  </h5>
               </Row>
               <Rule />
            </Wrapper>
         </Grid>
         <Row>
            <span>Vitamin A {data.vitaminA}%</span>
            <span>&bull;</span>
            <span>Vitamin C {data.vitaminC}%</span>
            <span>&bull;</span>
            <span>Calcium {data.calcium}%</span>
            <span>&bull;</span>
            <span>Iron {data.iron}%</span>
         </Row>
      </Container>
   )
}

export default Nutrition
