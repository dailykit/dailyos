import React, { useRef, useState, useEffect, useContext } from 'react'
import { Text, Loader, Flex, IconButton, Form } from '@dailykit/ui'
import { useSubscription, useQuery, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { useLocation } from 'react-router-dom'
import { useTabs } from '../../../context'
import { StyledWrapper } from './styled'
import BrandContext from '../../../context/Brand'
import {
   WEBSITE_PAGES_LISTING,
   WEBSITE_TOTAL_PAGES,
   WEBPAGE_ARCHIVED,
} from '../../../graphql'
import { Tooltip, InlineLoader } from '../../../../../shared/components'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { useTooltip } from '../../../../../shared/providers'

import { currencyFmt, logger } from '../../../../../shared/utils'
import options from '../tableOption'
import { toast } from 'react-toastify'

const PageListing = () => {
   const location = useLocation()
   const [context, setContext] = useContext(BrandContext)
   const { addTab, tab, closeAllTabs } = useTabs()
   const { tooltip } = useTooltip()
   const tableRef = useRef(null)
   const [pageList, setPageList] = useState([])
   //    const prevBrandId = useRef(context.brandId)

   //    Subscription
   const { loading, error } = useSubscription(WEBSITE_PAGES_LISTING, {
      variables: {
         websiteId: context.websiteId,
      },
      onSubscriptionData: ({
         subscriptionData: {
            data: { website_websitePage: websitePages = [] } = {},
         } = {},
      }) => {
         const result = websitePages.map(page => {
            return {
               id: page.id,
               internalPageName: page.internalPageName,
               url: page.route,
               pageVisit: 'N/A',
               published: page.published,
            }
         })
         setPageList(result)
      },
   })

   const {
      data: {
         website_websitePage_aggregate: { aggregate: { count = 0 } = {} } = {},
      } = {},
      loading: totalPagesLoading,
      error: totalPagesError,
   } = useSubscription(WEBSITE_TOTAL_PAGES, {
      variables: {
         websiteId: context.websiteId,
      },
   })

   //    Mutation
   const [deletePage] = useMutation(WEBPAGE_ARCHIVED, {
      onCompleted: () => {
         toast.success('Page deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Query

   useEffect(() => {
      if (!tab) {
         addTab('Pages', location.pathname)
      }
   }, [addTab, tab])

   // Handler
   const deleteHandler = (e, page) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete this page - ${page.internalPageName}?`
         )
      ) {
         deletePage({
            variables: {
               websiteId: context.websiteId,
               pageId: page.id,
            },
         })
      }
   }

   const rowClick = (e, cell) => {
      const { internalPageName } = cell._cell.row.data
      const param = `${location.pathname}/${internalPageName}`
      addTab(internalPageName, param)
   }

   const toggleHandler = (toggle, id) => {
      const val = !toggle
      // if (val && !isvalid) {
      //    toast.error(`Coupon should be valid!`)
      // } else {
      //   updateWebsitePage({
      //      variables: {
      //         id: id,
      //         set: {
      //            isActive: val,
      //         },
      //      },
      //   })
      // }
   }

   const DeleteButton = () => {
      return (
         <IconButton type="ghost">
            <DeleteIcon color="#FF5A52" />
         </IconButton>
      )
   }

   const ToggleButton = ({ cell }) => {
      const rowData = cell._cell.row.data
      return (
         <Form.Group>
            <Form.Toggle
               name={`[page_active${rowData.id}`}
               onChange={() => toggleHandler(rowData.published, rowData.id)}
               value={rowData.published}
            />
         </Form.Group>
      )
   }

   const columns = [
      {
         title: 'Internal Page Name',
         field: 'internalPageName',
         headerFilter: true,
         hozAlign: 'left',
         cssClass: 'rowClick',
         cellClick: (e, cell) => {
            rowClick(e, cell)
         },
         headerTooltip: function (column) {
            const identifier = 'page_listing_pageName_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'URL',
         field: 'url',
         headerFilter: true,
         hozAlign: 'left',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'left'
            return '' + cell.getValue()
         },
         headerTooltip: function (column) {
            const identifier = 'page_listing_url_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Page Visit',
         field: 'pageVisit',
         hozAlign: 'left',
         headerTooltip: function (column) {
            const identifier = 'page_listing_pageVisit_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         width: 150,
      },
      {
         title: 'Published',
         field: 'published',
         hozAlign: 'center',
         formatter: reactFormatter(<ToggleButton />),
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: '150',
         headerTooltip: function (column) {
            const identifier = 'page_listing_published_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteButton />),
         hozAlign: 'center',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   //    if (context.brandId !== prevBrandId.current) {
   //       closeAllTabs()
   //    }

   if (loading || totalPagesLoading) {
      return <InlineLoader />
   }
   if (error || totalPagesError) {
      toast.error('Something went wrong123!')
      logger(error || totalPagesError)
   }
   return (
      <StyledWrapper>
         <Flex container height="80px" alignItems="center">
            <Text as="title">
               Page(
               {count})
            </Text>
            <Tooltip identifier="customer_list_heading" />
         </Flex>

         {Boolean(pageList) && (
            <ReactTabulator
               columns={columns}
               data={pageList}
               options={{
                  ...options,
                  placeholder: 'No Customers Available Yet !',
               }}
               ref={tableRef}
            />
         )}
      </StyledWrapper>
   )
}

export default PageListing
