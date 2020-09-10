import React, { useState, useEffect, useRef } from 'react'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import {
   Text,
   ButtonGroup,
   IconButton,
   PlusIcon,
   Toggle,
   Loader,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import {
   CAMPAIGN_LISTING,
   CAMPAIGN_TOTAL,
   CAMPAIGN_ACTIVE,
   DELETE_CAMPAIGN,
} from '../../../graphql'
import { useTabs } from '../../../context'
import { StyledHeader, StyledWrapper } from './styled'
import tableOptions from '../tableOptions'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import CampaignTypeTunnel from './Tunnel'

const CampaignListing = () => {
   const { addTab, tab } = useTabs()
   const [campaign, setCampaign] = useState([])
   const tableRef = useRef(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   // Subscription
   const { loading: listLoading } = useSubscription(CAMPAIGN_LISTING, {
      onSubscriptionData: data => {
         const result = data.subscriptionData.data.campaigns.map(campaign => {
            return {
               id: campaign.id,
               name: campaign?.metaDetails?.title || '',
               type: campaign.campaignType,
               active: campaign.isActive,
            }
         })
         setCampaign(result)
      },
   })
   const { data: campaignTotal, loading } = useQuery(CAMPAIGN_TOTAL)

   // Mutation
   const [updateCampaignActive] = useMutation(CAMPAIGN_ACTIVE, {
      onCompleted: () => {
         toast.info('Coupon Updated!')
      },
      onError: error => {
         toast.error(`Error : ${error.message}`)
      },
   })
   React.useEffect(() => {
      if (!tab) {
         addTab('Customers', '/crm/customers')
      }
   }, [addTab, tab])

   const toggleHandler = (toggle, id) => {
      updateCampaignActive({
         variables: {
            campaignId: id,
            isActive: toggle,
         },
      })
   }

   const ToggleButton = ({ cell }) => {
      const rowData = cell._cell.row.data
      return (
         <Toggle
            checked={rowData.active}
            setChecked={() => toggleHandler(!rowData.active, rowData.id)}
         />
      )
   }

   const [deleteCampaign] = useMutation(DELETE_CAMPAIGN, {
      onCompleted: () => {
         toast.success('Campaign deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, Campaign) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete Campaign - ${Campaign.type}?`
         )
      ) {
         deleteCampaign({
            variables: {
               campaignId: Campaign.id,
            },
         })
      }
   }

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      const param = `/crm/campaign/${id}`
      const tabTitle = name
      addTab(tabTitle, param)
   }

   const columns = [
      { title: 'Campaign Name', field: 'name', headerFilter: true },
      { title: 'Campaign Type', field: 'type', headerFilter: true },
      {
         title: 'Active',
         field: 'active',
         formatter: reactFormatter(<ToggleButton />),
      },
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIcon color="#555B6E" />),
      },
   ]
   if (loading) return <Loader />
   if (listLoading) return <Loader />
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <CampaignTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader gridCol="10fr  1fr">
               <Text as="title">
                  Campaign(
                  {campaignTotal?.campaignsAggregate?.aggregate?.count || '...'}
                  )
               </Text>
               <ButtonGroup>
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <PlusIcon />
                  </IconButton>
               </ButtonGroup>
            </StyledHeader>

            <ReactTabulator
               columns={columns}
               data={campaign}
               rowClick={rowClick}
               options={tableOptions}
               ref={tableRef}
            />
         </StyledWrapper>
      </>
   )
}

export default CampaignListing
