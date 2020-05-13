import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, TextButton } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_SACHET } from '../../../../../graphql'
import { Container, TunnelBody, TunnelHeader } from '../styled'
import { FlexContainer, Flexible } from './styled'

const NutritionTunnel = ({ state, closeTunnel }) => {
   const { ingredientState } = React.useContext(IngredientContext)

   const [sachet, setSachet] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]
   )

   const [busy, setBusy] = React.useState(false)

   const [calories, setCalories] = React.useState(
      sachet.defaultNutritionalValues?.calories || ''
   )
   const [totalFat, setTotalFat] = React.useState(
      sachet.defaultNutritionalValues?.totalFat || ''
   )
   const [saturatedFat, setSaturatedFat] = React.useState(
      sachet.defaultNutritionalValues?.saturatedFat || ''
   )
   const [transFat, setTransFat] = React.useState(
      sachet.defaultNutritionalValues?.transFat || ''
   )
   const [cholesterol, setCholesterol] = React.useState(
      sachet.defaultNutritionalValues?.cholesterol || ''
   )
   const [sodium, setSodium] = React.useState(
      sachet.defaultNutritionalValues?.sodium || ''
   )
   const [totalCarbohydrates, setTotalCarbohydrates] = React.useState(
      sachet.defaultNutritionalValues?.totalCarbohydrates || ''
   )
   const [dietaryFibre, setDietaryFibre] = React.useState(
      sachet.defaultNutritionalValues?.dietaryFibre || ''
   )
   const [sugars, setSugars] = React.useState(
      sachet.defaultNutritionalValues?.sugars || ''
   )
   const [protein, setProtein] = React.useState(
      sachet.defaultNutritionalValues?.protein || ''
   )
   const [vitaminA, setVitaminA] = React.useState(
      sachet.defaultNutritionalValues?.vitaminA || ''
   )
   const [vitaminC, setVitaminC] = React.useState(
      sachet.defaultNutritionalValues?.vitaminC || ''
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
                  calories: calories,
                  totalFat: totalFat,
                  saturatedFat: saturatedFat,
                  transFat: transFat,
                  cholesterol: cholesterol,
                  sodium: sodium,
                  totalCarbohydrates: totalCarbohydrates,
                  dietaryFibre: dietaryFibre,
                  sugars: sugars,
                  protein: protein,
                  vitaminA: vitaminA,
                  vitaminC: vitaminC,
                  calcium: calcium,
                  iron: iron,
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
                        name="calories"
                        value={calories || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCalories(+e.target.value)
                        }}
                     />
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(calories)}
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
                        name="totalFat"
                        value={totalFat || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setTotalFat(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(totalFat)}
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
                        label="Cholesterol"
                        name="cholesterol"
                        value={cholesterol || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setCholesterol(+e.target.value)
                        }}
                     />
                     <div>mg</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(cholesterol)}
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
                     <div>mg</div>
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
                        value={totalCarbohydrates || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setTotalCarbohydrates(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(totalCarbohydrates)}
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
                        label="Dietary Fibre"
                        name="dietaryFibre"
                        value={dietaryFibre || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setDietaryFibre(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(dietaryFibre)}
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
                        label="Sugars"
                        name="sugars"
                        value={sugars || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setSugars(+e.target.value)
                        }}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(sugars)}
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
                        value={vitaminA || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setVitaminA(+e.target.value)
                        }}
                     />
                     <div>%</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(vitaminA)}
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
                        name="vitaminC"
                        value={vitaminC || ''}
                        onChange={e => {
                           if (sanitizeInput(e.target.value))
                              setVitaminC(+e.target.value)
                        }}
                     />
                     <div>%</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(vitaminC)}
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
                     <div>%</div>
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
                     <div>%</div>
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
