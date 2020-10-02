import React from 'react'
import _ from 'lodash'

import { useConfig } from '../../context'
import { Wrapper, Section, StatusBadge } from './styled'
import { LabelPrinterIcon, KotPrinterIcon, ScaleIcon } from '../../assets/icons'

const Footer = () => {
   const {
      state: { stations },
   } = useConfig()

   if (_.isEmpty(stations))
      return (
         <Wrapper>
            <Section title="Station">
               Station: You're are not assigned to any station!
            </Section>
         </Wrapper>
      )
   const [station] = stations
   return (
      <Wrapper>
         <Section title="Station">Station: {station.name}</Section>
         {station?.defaultKotPrinter && (
            <Section title="KOT Printer">
               <span>
                  <KotPrinterIcon />
               </span>
               KOT: {station.defaultKotPrinter.name}
               <StatusBadge status={station.defaultKotPrinter.state} />
            </Section>
         )}
         {station?.defaultLabelPrinter && (
            <Section title="Label Printer">
               <span>
                  <LabelPrinterIcon />
               </span>
               Label: {station.defaultLabelPrinter.name}
               <StatusBadge status={station.defaultLabelPrinter.state} />
            </Section>
         )}
         {station?.defaultScale && (
            <Section title="Scale">
               <span>
                  <ScaleIcon />
               </span>
               Scale: {station.defaultScale.deviceName}{' '}
               {station.defaultScale.deviceNum}
               <StatusBadge status={station.defaultScale.active && 'online'} />
            </Section>
         )}
      </Wrapper>
   )
}

export default Footer
