import React, { useState, useContext } from 'react'
import { Text, Input } from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelHeader,
   TunnelContainer,
   Spacer,
} from '../../../../../components'
import { FlexContainer, Flexible } from '../../../styled'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.nutritiontunnel.'

export default function NutritionTunnel({ close }) {
   const { t } = useTranslation()
   const {
      state: { nutriTarget },
      dispatch,
   } = useContext(ItemContext)

   const [cal, setCal] = useState(0)
   const [fat, setFat] = useState(0)
   const [saturatedFat, setSaturatedFat] = useState(0)
   const [transFat, setTransFat] = useState(0)
   const [cholestrol, setCholestrol] = useState(0)
   const [sodium, setSodium] = useState(0)
   const [carbs, setCarbs] = useState(0)
   const [dietryFibre, setDietryFibre] = useState(0)
   const [sugar, setSugar] = useState(0)
   const [protein, setProtein] = useState(0)
   const [vitA, setVitA] = useState(0)
   const [vitC, setVitC] = useState(0)
   const [calcium, setCalcium] = useState(0)
   const [iron, setIron] = useState(0)

   const sanitizeInput = value => {
      if (value.length === 0) return true
      if (parseInt(value)) return true

      return false
   }

   // change below function to calculate daily % value acc. to provided total nutrients
   const calcDailyValue = value => (value / 100) * 100

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('add nutrition values'))}
            next={() => {
               if (nutriTarget === 'processing') {
                  dispatch({
                     type: 'ADD_PROCESSING_NUTRIENT',
                     payload: {
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
                  })
               } else {
                  dispatch({
                     type: 'ADD_DERIVED_PROCESSING_NUTRIENT',
                     payload: {
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
                  })
               }
               close(10)
            }}
            close={() => close(10)}
            nextAction="Save"
         />

         <Spacer />

         <Text as="title">
            <Trans i18nKey={address.concat('title')}>
               Add the values as per 100gm and make your recipes smarter with
               auto-generated Nutritional Facts
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
               <Text as="subtitle">% {t(address.concat('daily value'))}</Text>
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
                     placeholder={t(address.concat('calories'))}
                     name="cal"
                     value={cal || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setCal(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
               </FlexContainer>
            </Flexible>
            <Flexible width="1">
               <span style={{ marginLeft: '20px' }}>{calcDailyValue(cal)}</span>
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
                     placeholder={t(address.concat('total fat'))}
                     name="fat"
                     value={fat || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setFat(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
               </FlexContainer>
            </Flexible>
            <Flexible width="1">
               <span style={{ marginLeft: '20px' }}>{calcDailyValue(fat)}</span>
            </Flexible>
         </FlexContainer>
         <br />
         <FlexContainer
            style={{ width: '60%', alignItems: 'flex-end', marginLeft: '40px' }}
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
                     placeholder={t(address.concat('saturated fat'))}
                     name="saturatedFat"
                     value={saturatedFat || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setSaturatedFat(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
            style={{ width: '60%', alignItems: 'flex-end', marginLeft: '40px' }}
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
                     placeholder={t(address.concat('trans fat'))}
                     name="transFat"
                     value={transFat || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setTransFat(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('cholestrol'))}
                     name="cholestrol"
                     value={cholestrol || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setCholestrol(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('sodium'))}
                     name="sodium"
                     value={sodium || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setSodium(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('total carbohydrate'))}
                     name="totalCarbs"
                     value={carbs || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.e)) setCarbs(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
            style={{ width: '60%', alignItems: 'flex-end', marginLeft: '40px' }}
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
                     placeholder={t(address.concat('dietry fibre'))}
                     name="dietryFibre"
                     value={dietryFibre || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setDietryFibre(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
            style={{ width: '60%', alignItems: 'flex-end', marginLeft: '40px' }}
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
                     placeholder={t(address.concat('sugar'))}
                     name="sugar"
                     value={sugar || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setSugar(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('protein'))}
                     name="protein"
                     value={protein || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setProtein(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('vitamin A'))}
                     name="vitaminA"
                     value={vitA || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setVitA(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('vitamin C'))}
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
                     placeholder={t(address.concat('calcium'))}
                     name="calcium"
                     value={calcium || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setCalcium(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
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
                     placeholder={t(address.concat('iron'))}
                     name="iron"
                     value={iron || ''}
                     onChange={e => {
                        if (sanitizeInput(e.target.value))
                           setIron(+e.target.value)
                     }}
                  />
                  <div>{t('units.gm')}</div>
               </FlexContainer>
            </Flexible>
            <Flexible width="1">
               <span style={{ marginLeft: '20px' }}>
                  {calcDailyValue(iron)}
               </span>
            </Flexible>
         </FlexContainer>
         <br />
      </TunnelContainer>
   )
}
