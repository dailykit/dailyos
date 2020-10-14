import React, { useState, useEffect, useRef } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import { Text, Flex, Toggle, Loader } from '@dailykit/ui'
import { BRAND_CAMPAIGNS, UPSERT_BRAND_CAMPAIGN } from '../../../../../graphql'
import { StyledHeader, StyledWrapper } from './styled'
import options from '../../../../tableOptions'
import { Tooltip } from '../../../../../../../shared/components'

const BrandCampaign = ({ state }) => {
   const tableRef = useRef()

   // Subscription
   const {
      loading: listloading,
      error,
      data: { brands = [] } = {},
   } = useSubscription(BRAND_CAMPAIGNS)

   const [upsertBrandCampaign] = useMutation(UPSERT_BRAND_CAMPAIGN, {
      onCompleted: data => {
         console.log(data)
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error(error.message)
      },
   })

   const columns = [
      {
         title: 'Title',
         field: 'title',
         hozAlign: 'left',
         headerFilter: true,
         headerSort: false,
      },
      {
         title: 'Domain',
         field: 'domain',
         hozAlign: 'left',
         headerFilter: true,
      },
      {
         title: 'Campaign Available',
         formatter: reactFormatter(
            <ToggleCampaign
               campaignId={state.id}
               onChange={object =>
                  upsertBrandCampaign({ variables: { object } })
               }
            />
         ),
         hozAlign: 'center',
         titleFormatter: function (cell, formatterParams, onRendered) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 200,
      },
   ]

   if (listloading) return <Loader />

   return (
      <StyledWrapper>
         <Flex container alignItems="center" padding="6px">
            <Text as="h2">Brands</Text>
            <Tooltip identifier="brand_campaign_list_heading" />
         </Flex>
         {error ? (
            <Text as="p">Could not load brands</Text>
         ) : (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={brands}
               options={{
                  ...options,
                  placeholder: 'No Brand Campaigns Data Available Yet !',
               }}
            />
         )}
      </StyledWrapper>
   )
}

export default BrandCampaign

const ToggleCampaign = ({ cell, campaignId, onChange }) => {
   const brand = useRef(cell.getData())
   const [active, setActive] = useState(false)

   const toggleHandler = value => {
      console.log(value)
      onChange({
         campaignId,
         brandId: brand.current.id,
         isActive: value,
      })
   }

   React.useEffect(() => {
      console.log(brand)
      const isActive = brand.current.brand_campaigns.some(
         campaign => campaign.campaignId === campaignId && campaign.isActive
      )
      console.log(isActive)
      setActive(isActive)
   }, [brand.current])

   return <Toggle checked={active} setChecked={val => toggleHandler(val)} />
}
