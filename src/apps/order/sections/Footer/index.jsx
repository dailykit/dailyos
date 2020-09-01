import React from 'react'

import { useAuth } from '../../context'
import { Wrapper, Section, StatusBadge } from './styled'
import { LabelPrinterIcon, KotPrinterIcon, ScaleIcon } from '../../assets/icons'

const Footer = () => {
   const { station } = useAuth()

   return (
      <Wrapper>
         {Object.keys(station).length > 0 && (
            <Section title="Station">Station: {station.name}</Section>
         )}
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
