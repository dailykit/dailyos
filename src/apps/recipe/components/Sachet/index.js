import React from 'react'

import { Text } from '@dailykit/ui'

import { StyledContainer, StyledTopBar } from './styled'
import { StyledTable } from '../styled'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.components.sachet.'

const Sachet = ({ sachet }) => {
   const { t } = useTranslation()
   const [activeMode, setActiveMode] = React.useState('')

   console.log('SACHET: ', sachet)

   React.useEffect(() => {
      if (sachet) {
         const mode = sachet.modeOfFulfillments.find(
            mode => mode.id === sachet.liveMOF
         )
         setActiveMode(mode?.type || '')
      }
   }, [sachet])

   return (
      <StyledContainer>
         <StyledTopBar>
            <p>
               {sachet?.tracking ? t(address.concat('taken inventory')) : ' '}
            </p>
            <span>
               {t(address.concat('live'))}: {activeMode}
            </span>
         </StyledTopBar>
         <StyledTable cellSpacing={0} noActions>
            <thead>
               <tr>
                  <th>{t(address.concat('mode of fulfillment'))}</th>
                  <th>{t(address.concat('station'))}</th>
                  <th>{t(address.concat('item'))}</th>
                  <th>{t(address.concat('accuracy'))}</th>
                  <th>{t(address.concat('packaging'))}</th>
                  <th>{t(address.concat('label'))}</th>
               </tr>
            </thead>
            <tbody>
               {sachet?.modeOfFulfillments.map(mode => (
                  <tr key={mode.type}>
                     <td>
                        <span className="badge">
                           {t(address.concat('active'))}
                        </span>
                        {mode.type}
                     </td>
                     <td>{mode.station.name}</td>
                     <td>
                        {mode.sachetItem?.unitSize ||
                           mode.bulkItem?.processingName}
                     </td>
                     <td>
                        {mode.accuracy
                           ? t(address.concat('atleast ')) + mode.accuracy + '%'
                           : t(address.concat('not weighing'))}
                     </td>
                     <td>{mode.packaging.name}</td>
                     <td>
                        {mode.isLabelled
                           ? mode.labelTemplate.title
                           : t(address.concat('not labelled'))}
                     </td>
                  </tr>
               ))}
            </tbody>
         </StyledTable>
         {sachet.defaultNutritionalValues && (
            <React.Fragment>
               <Text as="h2">Default Nutritional Values</Text>
               <Text as="p">
                  <strong>{t(address.concat('calories'))}: </strong>
                  {sachet.defaultNutritionalValues.cal}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('total fat'))}: </strong>
                  {sachet.defaultNutritionalValues.fat}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('saturated fat'))}: </strong>
                  {sachet.defaultNutritionalValues.saturatedFat}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('trans fat'))}: </strong>
                  {sachet.defaultNutritionalValues.transFat}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('cholestrol'))}: </strong>
                  {sachet.defaultNutritionalValues.cholestrol}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('sodium'))}:</strong>
                  {sachet.defaultNutritionalValues.sodium}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('total carbohydrates'))}: </strong>
                  {sachet.defaultNutritionalValues.carbs}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('dietry fibre'))}: </strong>
                  {sachet.defaultNutritionalValues.dietryFibre}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('sugar'))}: </strong>
                  {sachet.defaultNutritionalValues.sugar}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('protein'))}: </strong>
                  {sachet.defaultNutritionalValues.protein}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('vitamin A'))}: </strong>
                  {sachet.defaultNutritionalValues.vitA}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('vitamin C'))}: </strong>
                  {sachet.defaultNutritionalValues.vitC}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('calcium'))}: </strong>
                  {sachet.defaultNutritionalValues.calcium}
               </Text>
               <Text as="p">
                  <strong>{t(address.concat('iron'))}: </strong>
                  {sachet.defaultNutritionalValues.iron}
               </Text>
            </React.Fragment>
         )}
      </StyledContainer>
   )
}

export default Sachet
