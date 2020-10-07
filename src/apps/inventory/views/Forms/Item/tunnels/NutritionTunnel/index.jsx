import React, { useState, useContext } from 'react'
import { Text, Input, TunnelHeader, Loader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useTranslation, Trans } from 'react-i18next'

import { ItemContext } from '../../../../../context/item'

import { TunnelContainer, Spacer } from '../../../../../components'
import { FlexContainer, Flexible } from '../../../styled'
import { useSubscription } from '@apollo/react-hooks'
import { NUTRITION_INFO } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.nutritiontunnel.'

export default function NutritionTunnel({ close, bulkItemId }) {
   const { t } = useTranslation()
   const {
      state: { nutriTarget },
      dispatch,
   } = useContext(ItemContext)

   const [state, setState] = useState({})
   const [valid, setValid] = useState(true)

   const {
      data: { bulkItem: { nutritionInfo = {} } = {} } = {},
      loading,
   } = useSubscription(NUTRITION_INFO, {
      variables: {
         id: bulkItemId,
      },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.bulkItem.nutritionInfo
         setState(data)
      },
   })
   const [per, setPer] = useState(nutritionInfo.per || 100)

   // change below function to calculate daily % value acc. to provided total nutrients
   const calcDailyValue = value => (value / 100) * 100

   const checkInput = value => {
      if (!value.length) return setValid(true)

      if (!+value) {
         if (value === '0') return setValid(true)
         toast.error('Invalid Input')
         setValid(false)
      }
      if (+value) setValid(true)
   }

   // prettier-ignore
   const handleChange = (value, name) => setState(values => ({ ...values, [name]: value }))

   const handleNext = () => {
      if (valid) {
         const payload = {
            per: +state.per || 100,
            calories: +state.calories || 0,
            totalFat: +state.totalFat || 0,
            saturatedFat: +state.saturatedFat || 0,
            transFat: +state.transFat || 0,
            cholesterol: +state.cholesterol || 0,
            sodium: +state.sodium || 0,
            totalCarbohydrates: +state.totalCarbohydrates || 0,
            dietaryFibre: +state.dietaryFibre || 0,
            sugars: +state.sugars || 0,
            protein: +state.protein || 0,
            vitaminA: +state.vitaminA || 0,
            vitaminC: +state.vitaminC || 0,
            calcium: +state.calcium || 0,
            iron: +state.iron || 0,
         }

         if (nutriTarget === 'processing') {
            dispatch({
               type: 'ADD_PROCESSING_NUTRIENT',
               payload,
            })
         } else {
            dispatch({
               type: 'ADD_DERIVED_PROCESSING_NUTRIENT',
               payload,
            })
         }
         close(1)
      } else {
         toast.error('Invalid inputs, fill only numbers')
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add nutrition values'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <Text as="title">
               <Trans i18nKey={address.concat('title')}>
                  Add the values as per {per}gm and make your recipes smarter
                  with auto-generated Nutritional Facts
               </Trans>
            </Text>
            <Text as="subtitle">
               <Trans i18nKey={address.concat('subtitle')}>
                  You can skip the values you don’t want to put.
               </Trans>
            </Text>

            <Spacer />

            <FlexContainer style={{ width: '60%' }}>
               <Flexible width="2" />
               <Flexible width="1">
                  <Text as="subtitle">
                     % {t(address.concat('daily value'))}
                  </Text>
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
                        type="number"
                        label={t(address.concat('calories'))}
                        name="cal"
                        value={state.calories || ''}
                        onChange={e => handleChange(e.target.value, 'calories')}
                        onBlur={() => checkInput(state.calories)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.calories)}
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
                        type="number"
                        label={t(address.concat('total fat'))}
                        name="fat"
                        value={state.totalFat || ''}
                        onChange={e => handleChange(e.target.value, 'totalFat')}
                        onBlur={() => checkInput(state.totalFat)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.totalFat)}
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
                        type="number"
                        label={t(address.concat('saturated fat'))}
                        name="saturatedFat"
                        value={state.saturatedFat || ''}
                        onChange={e =>
                           handleChange(e.target.value, 'saturatedFat')
                        }
                        onBlur={() => checkInput(state.saturatedFat)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.saturatedFat)}
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
                        type="number"
                        label={t(address.concat('trans fat'))}
                        name="transFat"
                        value={state.transFat || ''}
                        onChange={e => handleChange(e.target.value, 'transFat')}
                        onBlur={() => checkInput(state.transFat)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.transFat)}
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
                        type="number"
                        label={t(address.concat('cholestrol'))}
                        name="cholestrol"
                        value={state.cholesterol || ''}
                        onChange={e =>
                           handleChange(e.target.value, 'cholestrol')
                        }
                        onBlur={() => checkInput(state.cholesterol)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.cholesterol)}
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
                        type="number"
                        label={t(address.concat('sodium'))}
                        name="sodium"
                        value={state.sodium || ''}
                        onChange={e => handleChange(e.target.value, 'sodium')}
                        onBlur={() => checkInput(state.sodium)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.sodium)}
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
                        type="number"
                        label={t(address.concat('total carbohydrates'))}
                        name="totalCarbs"
                        value={state.totalCarbohydrates || ''}
                        onChange={e =>
                           handleChange(e.target.value, 'totalCarbohydrates')
                        }
                        onBlur={() => checkInput(state.totalCarbohydrates)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.totalCarbohydrates)}
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
                        type="number"
                        label={t(address.concat('dietry fiber'))}
                        name="dietaryFibre"
                        value={state.dietaryFibre || ''}
                        onChange={e =>
                           handleChange(e.target.value, 'dietaryFibre')
                        }
                        onBlur={() => checkInput(state.dietaryFibre)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.dietaryFibre)}
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
                        type="number"
                        label={t(address.concat('sugar'))}
                        name="sugar"
                        value={state.sugars || ''}
                        onChange={e => handleChange(e.target.value, 'sugars')}
                        onBlur={() => checkInput(state.sugars)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.sugars)}
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
                        type="number"
                        label={t(address.concat('protein'))}
                        name="protein"
                        value={state.protein || ''}
                        onChange={e => handleChange(e.target.value, 'protein')}
                        onBlur={() => checkInput(state.protein)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.protein)}
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
                        type="number"
                        label={t(address.concat('vitamin A'))}
                        name="vitaminA"
                        value={state.vitaminA || ''}
                        onChange={e => handleChange(e.target.value, 'vitaminA')}
                        onBlur={() => checkInput(state.vitaminA)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.vitaminA)}
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
                        type="number"
                        label={t(address.concat('vitamin C'))}
                        name="vitC"
                        value={state.vitaminC || ''}
                        onChange={e => handleChange(e.target.value, 'vitaminC')}
                        onBlur={() => checkInput(state.vitaminC)}
                     />
                     <div>gm</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.vitaminC)}
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
                        type="number"
                        label={t(address.concat('calcium'))}
                        name="calcium"
                        value={state.calcium || ''}
                        onChange={e => handleChange(e.target.value, 'calcium')}
                        onBlur={() => checkInput(state.calcium)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.calcium)}
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
                        type="number"
                        label={t(address.concat('iron'))}
                        name="iron"
                        value={state.iron || ''}
                        onChange={e => handleChange(e.target.value, 'iron')}
                        onBlur={() => checkInput(state.iron)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(state.iron)}
                  </span>
               </Flexible>
            </FlexContainer>
            <br />
         </TunnelContainer>
      </>
   )
}
