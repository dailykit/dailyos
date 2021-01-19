import React from 'react'
import _, { isEmpty } from 'lodash'

import { useConfig } from '../../context'
import { Wrapper, Section, StatusBadge } from './styled'
import { LabelPrinterIcon, KotPrinterIcon, ScaleIcon } from '../../assets/icons'

const Footer = () => {
   const {
      state: { current_station: station },
   } = useConfig()

   if (_.isEmpty(station))
      return (
         <Wrapper>
            <Section title="Station">
               Station: You're are not assigned to any station!
            </Section>
         </Wrapper>
      )
   return (
      <Wrapper>
         <Section title="Station">Station: {station.name}</Section>
         {station?.defaultKotPrinterId ? (
            <Section title="KOT Printer">
               <span>
                  <KotPrinterIcon />
               </span>
               KOT: {station.defaultKotPrinter.name}
               <StatusBadge status={station.defaultKotPrinter.state} />
            </Section>
         ) : !isEmpty(station.attachedKotPrinters) ? (
            <Section title="KOT Printer">
               <span>
                  <KotPrinterIcon />
               </span>
               KOT: {station.attachedKotPrinters[0].kotPrinter.name}
               <StatusBadge
                  status={station.attachedKotPrinters[0].kotPrinter.state}
               />
            </Section>
         ) : null}
         {station?.defaultLabelPrinterId ? (
            <Section title="Label Printer">
               <span>
                  <LabelPrinterIcon />
               </span>
               Label: {station.defaultLabelPrinter.name}
               <StatusBadge status={station.defaultLabelPrinter.state} />
            </Section>
         ) : !isEmpty(station.attachedLabelPrinters) ? (
            <Section title="Label Printer">
               <span>
                  <LabelPrinterIcon />
               </span>
               Label: {station.attachedLabelPrinters[0].labelPrinter.name}
               <StatusBadge
                  status={station.attachedLabelPrinters[0].labelPrinter.state}
               />
            </Section>
         ) : null}
         {station?.defaultScaleId ? (
            <Section title="Scale">
               <span>
                  <ScaleIcon />
               </span>
               Scale: {station.defaultScale.deviceName}{' '}
               {station.defaultScale.deviceNum}
               <StatusBadge status={station.defaultScale.active && 'online'} />
            </Section>
         ) : !isEmpty(station.assignedScales) ? (
            <Section title="Scale">
               <span>
                  <ScaleIcon />
               </span>
               Scale: {station.assignedScales[0].deviceName}{' '}
               {station.assignedScales[0].deviceNum}
               <StatusBadge
                  status={station.assignedScales[0].active && 'online'}
               />
            </Section>
         ) : null}
      </Wrapper>
   )
}

export default Footer
