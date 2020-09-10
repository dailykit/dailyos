import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
// Components
import { IconButton, Loader } from '@dailykit/ui'
import * as moment from 'moment'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import tableOptions from '../tableOption'

// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'
// State
import { Context } from '../../../context/tabs'
import {
   CREATE_SAFETY_CHECK,
   SAFETY_CHECKS,
   DELETE_SAFETY_CHECK,
} from '../../../graphql'
// Styled
import { StyledHeader, StyledWrapper } from '../styled'

const address = 'apps.safety.views.listings.safetycheckslisting.'
const SafetyChecksListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   // Queries
   const { data: { safety_safetyCheck = [] } = {}, loading } = useSubscription(
      SAFETY_CHECKS,
      {
         onError: error => {
            console.log(error)
         },
      }
   )

   // Mutation
   const [createSafetyCheck] = useMutation(CREATE_SAFETY_CHECK, {
      onCompleted: input => {
         addTab(
            'Check',
            'check',
            input.insert_safety_safetyCheck.returning[0].id
         )
         toast.success('Initiated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Some error occurred!')
      },
   })
   const [deleteSafetyCheck] = useMutation(DELETE_SAFETY_CHECK, {
      onCompleted: () => {
         toast.success('Safety check deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('safety checks'))}</h1>
            <IconButton type="solid" onClick={createSafetyCheck}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>

         <DataTable
            data={safety_safetyCheck}
            addTab={addTab}
            deleteCheck={deleteSafetyCheck}
         />
      </StyledWrapper>
   )
}

function DataTable({ data, addTab, deleteCheck }) {
   const { t } = useTranslation()

   const tableRef = React.useRef()

   const rowClick = (e, row) => {
      const { id } = row._row.data
      addTab('Check', 'check', id)
   }

   const columns = [
      {
         title: t(address.concat('time')),
         field: 'created_at',
         headerFilter: false,
         formatter: reactFormatter(<ShowDate />),
      },
      {
         title: t(address.concat('users tested')),
         field: 'SafetyCheckPerUsers',
         headerFilter: false,
         headerSort: false,
         formatter: reactFormatter(<ShowCount />),
      },

      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            const { id } = cell._cell.row.data
            deleteCheck({
               variables: { id },
            })
         },
         formatter: reactFormatter(<DeleteCheck />),
      },
   ]

   return (
      <div>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={tableOptions}
         />
      </div>
   )
}

function DeleteCheck() {
   return <DeleteIcon color="#FF5A52" />
}

function ShowDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{moment(value).format('LLL')}</>
}

function ShowCount({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.length) return value.length
   return '0'
}

export default SafetyChecksListing
