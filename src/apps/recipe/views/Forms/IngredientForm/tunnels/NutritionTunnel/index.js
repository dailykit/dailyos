import React from 'react'
import { Text, Input, TextButton } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { TunnelHeader, TunnelBody, Container } from '../styled'
import { FlexContainer, Flexible } from './styled'
import { IngredientContext } from '../../../../../context/ingredient'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_SACHET } from '../../../../../graphql'
import { toast } from 'react-toastify'

const NutritionTunnel = ({ state, closeTunnel }) => {
   const { ingredientState } = React.useContext(IngredientContext)

   const [sachet, setSachet] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]
   )

   const [busy, setBusy] = React.useState(false)

   const [cal, setCal] = React.useState(
      sachet.defaultNutritionalValues?.cal || ''
   )
   const [fat, setFat] = React.useState(
      sachet.defaultNutritionalValues?.fat || ''
   )
   const [saturatedFat, setSaturatedFat] = React.useState(
      sachet.defaultNutritionalValues?.saturatedFat || ''
   )
   const [transFat, setTransFat] = React.useState(
      sachet.defaultNutritionalValues?.transFat || ''
   )
   const [cholestrol, setCholestrol] = React.useState(
      sachet.defaultNutritionalValues?.cholestrol || ''
   )
   const [sodium, setSodium] = React.useState(
      sachet.defaultNutritionalValues?.sodium || ''
   )
   const [carbs, setCarbs] = React.useState(
      sachet.defaultNutritionalValues?.carbs || ''
   )
   const [dietryFibre, setDietryFibre] = React.useState(
      sachet.defaultNutritionalValues?.dietryFibre || ''
   )
   const [sugar, setSugar] = React.useState(
      sachet.defaultNutritionalValues?.sugar || ''
   )
   const [protein, setProtein] = React.useState(
      sachet.defaultNutritionalValues?.protein || ''
   )
   const [vitA, setVitA] = React.useState(
      sachet.defaultNutritionalValues?.vitA || ''
   )
   const [vitC, setVitC] = React.useState(
      sachet.defaultNutritionalValues?.vitC || ''
   )
   const [calcium, setCalcium] = React.useState(
      sachet.defaultNutritionalValues?.calcium || ''
   )
   const [iron, setIron] = React.useState(
      sachet.defaultNutritionalValues?.iron || ''
   )

   const sanitizeInput = value => {
      if (value.length === 0) return true
      if (parseInt(value)) return true

      return false
   }

   // change below function to calculate daily % value acc. to provided total nutrients
   const calcDailyValue = value => (value / 100) * 100

   // Mutation
   const [updateSachet] = useMutation(UPDATE_SACHET, {
      onCompleted: () => {
         toast.success('Nutritional values updated!')
         closeTunnel(13)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateSachet({
         variables: {
            id: sachet.id,
            set: {
               defaultNutritionalValues: {
                  cal,
                  fat,
                  saturatedFat,
                  transFat,
                  cholestrol,
                  sodium,
                  carbs,
                  dietryFibre,
                  sugar,
                  protein,
                  vitA,
                  vitC,
                  calcium,
                  iron,
               },
            },
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(13)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Default Nutritional Values</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Container bottom="16">
               <Text as="title">
                  Add the values as per 100gm and make your recipes smarter with
                  auto-generated Nutritional Facts
               </Text>
               <Text as="subtitle">
                  You can skip the values you don’t want to put.
               </Text>
            </Container>
            <Container bottom="32">
               <FlexContainer style={{ width: '60%' }}>
                  <Flexible width="2" />
                  <Flexible width="1">
                     <Text as="subtitle">% Daily Value</Text>
                  </Flexible>
               </FlexContainer>
            </Container>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Calories"
                        name="cal"
                        value={cal || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCal(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(cal)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Total Fat"
                        name="fat"
                        value={fat || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setFat(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(fat)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer
               style={{
                  width: '60%',
                  alignItems: 'flex-end',
                  marginLeft: '40px',
               }}
            >
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Saturated Fat"
                        name="saturatedFat"
                        value={saturatedFat || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setSaturatedFat(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(saturatedFat)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer
               style={{
                  width: '60%',
                  alignItems: 'flex-end',
                  marginLeft: '40px',
               }}
            >
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Trans Fat"
                        name="transFat"
                        value={transFat || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setTransFat(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(transFat)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Cholestrol"
                        name="cholestrol"
                        value={cholestrol || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCholestrol(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(cholestrol)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Sodium"
                        name="sodium"
                        value={sodium || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setSodium(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(sodium)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Total Carbohydrates"
                        name="totalCarbs"
                        value={carbs || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCarbs(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(carbs)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer
               style={{
                  width: '60%',
                  alignItems: 'flex-end',
                  marginLeft: '40px',
               }}
            >
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Dietry Fibre"
                        name="dietryFibre"
                        value={dietryFibre || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setDietryFibre(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(dietryFibre)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer
               style={{
                  width: '60%',
                  alignItems: 'flex-end',
                  marginLeft: '40px',
               }}
            >
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Sugar"
                        name="sugar"
                        value={sugar || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setSugar(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(sugar)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Protein"
                        name="protein"
                        value={protein || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setProtein(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(protein)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Vitamin A"
                        name="vitaminA"
                        value={vitA || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setVitA(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(vitA)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Vitamin C"
                        name="vitC"
                        value={vitC || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setVitC(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(vitC)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Calcium"
                        name="calcium"
                        value={calcium || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCalcium(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(calcium)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
            <FlexContainer style={{ width: '60%', alignItems: 'flex-end' }}>
               <Flexible width="2">
                  <FlexContainer
                     style={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                     }}
                  >
                     <Input
                        type="text"
                        label="Iron"
                        name="iron"
                        value={iron || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setIron(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(iron)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
         </TunnelBody>
      </React.Fragment>
   )
}

export default NutritionTunnel
