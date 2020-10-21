import React from 'react'
import { Trans } from 'react-i18next'
import { TunnelHeader,Text,Spacer} from '@dailykit/ui'
import { SolidTile, TunnelBody } from '../styled'
import { useTabs } from '../../../context'

export const InformationList = ({closeTunnel}) => {
   
   const { addTab } = useTabs()
   const onClick = type => {
      switch(type){
         case 'grid' :
            addTab('Add Grid Info', '/content/blocks/grid-form')
            break
         case 'faq' :
            addTab('Add FAQ Info', '/content/blocks/faq-form')
            break
         default:
            break
      }
}

    return (
        <div>
            <TunnelHeader
            title={'Create Information Grid or Information FAQ'}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            <SolidTile onClick={() => onClick('grid')}>
               <Text as="h2">Information Grid</Text>
               <Text as="subtitle">
                  <Trans>
                     Create a new Information Grid by clicking here
                  </Trans>
               </Text>
            </SolidTile>
            <Spacer size = "15px" />
            <SolidTile onClick={() => onClick('faq')}>
               <Text as="h2">FAQS</Text>
               <Text as="subtitle">
                  <Trans>
                     Create a new FAQ by clicking here
                  </Trans>
               </Text>
            </SolidTile>
            </TunnelBody>
        </div>
    )
}
