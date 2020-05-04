import React from 'react'

import { StyledContainer, StyledTopBar } from './styled'
import { StyledTable } from '../styled'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.components.sachet.'

const Sachet = ({ sachet }) => {
   const { t } = useTranslation()
   const [activeMode, setActiveMode] = React.useState('')

   React.useEffect(() => {
      if (sachet) {
         const mode = sachet.modes.find(mode => mode.isActive === true)
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
                  <th>{t(address.concat('supplier item'))}</th>
                  <th>{t(address.concat('accuracy'))}</th>
                  <th>{t(address.concat('packaging'))}</th>
                  <th>{t(address.concat('label'))}</th>
               </tr>
            </thead>
            <tbody>
               {sachet?.modes.map(mode => (
                  <tr key={mode.type}>
                     <td>
                        <span className="badge">
                           {t(address.concat('active'))}
                        </span>
                        {mode.type}
                     </td>
                     <td>{mode.station.title}</td>
                     <td>{mode.supplierItems[0]?.item.title}</td>
                     <td>
                        {mode.supplierItems[0]?.accuracy
                           ? t(address.concat('atleast ')) +
                             mode.supplierItems[0]?.accuracy +
                             '%'
                           : t(address.concat('not weighing'))}
                     </td>
                     <td>{mode.supplierItems[0]?.packaging.title}</td>
                     <td>
                        {mode.supplierItems[0]?.isLabelled
                           ? mode.supplierItems[0]?.labelTemplate.title
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
