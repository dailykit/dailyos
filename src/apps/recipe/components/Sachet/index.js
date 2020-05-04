import React from 'react'

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
            mode => mode.isLive === true
         )
         setActiveMode(mode.type)
      }
   }, [sachet])

   return (
      <StyledContainer>
         <StyledTopBar>
            <p>
               {sachet?.tracking ? t(address.concat('taken inventory')) : ' '}
            </p>
            <span>
               {t(address.concat('active'))}: {activeMode}
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
                     <td>{mode.sachetItem.unitSize}</td>
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
      </StyledContainer>
   )
}

export default Sachet
