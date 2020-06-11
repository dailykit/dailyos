import React from 'react'

import { TextButton, Tag } from '@dailykit/ui'

import {
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
} from '../../../../../components'

import { Header } from './styled'

export const Printers = ({ station }) => {
   return (
      <SectionTabs>
         <SectionTabList>
            <TextButton type="outline" style={{ marginBottom: 8 }}>
               Add Printer
            </TextButton>
            {station.printer.nodes.map(node => (
               <SectionTab
                  key={node.printer.printNodeId}
                  title={node.printer.name}
               />
            ))}
         </SectionTabList>
         <SectionTabPanels>
            {station.printer.nodes.map(node => (
               <SectionTabPanel key={node.printer.printNodeId}>
                  <Header>
                     <div>
                        <h2>{node.printer.name}</h2>
                        {node.active && <Tag>Active</Tag>}
                     </div>
                  </Header>
               </SectionTabPanel>
            ))}
         </SectionTabPanels>
      </SectionTabs>
   )
}
