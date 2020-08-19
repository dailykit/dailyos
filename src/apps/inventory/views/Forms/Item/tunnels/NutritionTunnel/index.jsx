import React, { useState, useContext } from 'react'
import { Text, Input, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useTranslation, Trans } from 'react-i18next'

import { ItemContext } from '../../../../../context/item'

import { TunnelContainer, Spacer } from '../../../../../components'
import { FlexContainer, Flexible } from '../../../styled'

const address = 'apps.inventory.views.forms.item.tunnels.nutritiontunnel.'

export default function NutritionTunnel({ close }) {
   const { t } = useTranslation()
   const {
      state: { nutriTarget },
      dispatch,
   } = useContext(ItemContext)

   const [per, setPer] = useState(100)
   const [cal, setCal] = useState('')
   const [fat, setFat] = useState('')
   const [saturatedFat, setSaturatedFat] = useState('')
   const [transFat, setTransFat] = useState('')
   const [cholestrol, setCholestrol] = useState('')
   const [sodium, setSodium] = useState('')
   const [carbs, setCarbs] = useState('')
   const [dietryFiber, setDietryFiber] = useState('')
   const [sugar, setSugar] = useState('')
   const [protein, setProtein] = useState('')
   const [vitA, setVitA] = useState('')
   const [vitC, setVitC] = useState('')
   const [calcium, setCalcium] = useState('')
   const [iron, setIron] = useState('')
   const [valid, setValid] = useState(true)

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

   const handleNext = () => {
      if (valid) {
         if (nutriTarget === 'processing') {
            dispatch({
               type: 'ADD_PROCESSING_NUTRIENT',
               payload: {
                  per: +per,
                  cal: +cal,
                  fat: +fat,
                  saturatedFat: +saturatedFat,
                  transFat: +transFat,
                  cholestrol: +cholestrol,
                  sodium: +sodium,
                  carbs: +carbs,
                  dietryFiber: +dietryFiber,
                  sugar: +sugar,
                  protein: +protein,
                  vitA: +vitA,
                  vitC: +vitC,
                  calcium: +calcium,
                  iron: +iron,
               },
            })
         } else {
            dispatch({
               type: 'ADD_DERIVED_PROCESSING_NUTRIENT',
               payload: {
                  per,
                  cal,
                  fat,
                  saturatedFat,
                  transFat,
                  cholestrol,
                  sodium,
                  carbs,
                  dietryFiber,
                  sugar,
                  protein,
                  vitA,
                  vitC,
                  calcium,
                  iron,
               },
            })
         }
         close(1)
      } else {
         toast.error('Invalid inputs, fill only numbers')
      }
   }

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
                        value={cal || ''}
                        onChange={e => setCal(e.target.value)}
                        onBlur={() => checkInput(cal)}
                     />
                     <div>{t('units.gm')}</div>
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
                        type="number"
                        label={t(address.concat('total fat'))}
                        name="fat"
                        value={fat || ''}
                        onChange={e => setFat(e.target.value)}
                        onBlur={() => checkInput(fat)}
                     />
                     <div>{t('units.gm')}</div>
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
                        type="number"
                        label={t(address.concat('saturated fat'))}
                        name="saturatedFat"
                        value={saturatedFat || ''}
                        onChange={e => setSaturatedFat(e.target.value)}
                        onBlur={() => checkInput(saturatedFat)}
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
                        value={transFat || ''}
                        onChange={e => setTransFat(e.target.value)}
                        onBlur={() => checkInput(transFat)}
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
                        type="number"
                        label={t(address.concat('cholestrol'))}
                        name="cholestrol"
                        value={cholestrol || ''}
                        onChange={e => setCholestrol(e.target.value)}
                        onBlur={() => checkInput(cholestrol)}
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
                        type="number"
                        label={t(address.concat('sodium'))}
                        name="sodium"
                        value={sodium || ''}
                        onChange={e => setSodium(e.target.value)}
                        onBlur={() => checkInput(sodium)}
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
                        type="number"
                        label={t(address.concat('total carbohydrates'))}
                        name="totalCarbs"
                        value={carbs || ''}
                        onChange={e => setCarbs(e.target.value)}
                        onBlur={() => checkInput(carbs)}
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
                        name="dietryFibre"
                        value={dietryFiber || ''}
                        onChange={e => setDietryFiber(e.target.value)}
                        onBlur={() => checkInput(dietryFiber)}
                     />
                     <div>{t('units.gm')}</div>
                  </FlexContainer>
               </Flexible>
               <Flexible width="1">
                  <span style={{ marginLeft: '20px' }}>
                     {calcDailyValue(dietryFiber)}
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
                        value={sugar || ''}
                        onChange={e => setSugar(e.target.value)}
                        onBlur={() => checkInput(sugar)}
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
                        type="number"
                        label={t(address.concat('protein'))}
                        name="protein"
                        value={protein || ''}
                        onChange={e => setProtein(e.target.value)}
                        onBlur={() => checkInput(protein)}
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
                        type="number"
                        label={t(address.concat('vitamin A'))}
                        name="vitaminA"
                        value={vitA || ''}
                        onChange={e => setVitA(e.target.value)}
                        onBlur={() => checkInput(vitA)}
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
                        type="number"
                        label={t(address.concat('vitamin C'))}
                        name="vitC"
                        value={vitC || ''}
                        onChange={e => setVitC(e.target.value)}
                        onBlur={() => checkInput(vitC)}
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
                        type="number"
                        label={t(address.concat('calcium'))}
                        name="calcium"
                        value={calcium || ''}
                        onChange={e => setCalcium(e.target.value)}
                        onBlur={() => checkInput(calcium)}
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
                        type="number"
                        label={t(address.concat('iron'))}
                        name="iron"
                        value={iron || ''}
                        onChange={e => setIron(e.target.value)}
                        onBlur={() => checkInput(iron)}
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
      </>
   )
}
