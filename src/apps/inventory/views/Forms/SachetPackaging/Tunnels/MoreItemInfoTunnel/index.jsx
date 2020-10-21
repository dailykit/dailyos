import { useMutation } from '@apollo/react-hooks'
import { Form, Loader, Spacer, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import { UPDATE_PACKAGING } from '../../../../../graphql'
import { StyledInputGroup } from '../../../Item/tunnels/styled'

export default function MoreItemInfoTunnel({ close, state }) {
   const [unitQuantity, setUnitQuantity] = useState(state.unitQuantity || '')
   const [unitPrice, setUnitPrice] = useState(state.unitPrice || '')
   const [caseQuantity, setCaseQuantity] = useState(state.caseQuantity || '')
   const [minOrderValue, setMinOrderValue] = useState(state.minOrderValue || '')
   const [leadTime, setLeadTime] = useState(state.leadTime?.value || '')
   const [leadTimeUnit, setLeadTimeUnit] = useState(
      state.leadTime?.unit || 'hours'
   )

   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         close(2)
         toast.info('updated successfully!')
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(2)
      },
   })

   const handleNext = () => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               unitPrice: +unitPrice,
               unitQuantity: +unitQuantity,
               caseQuantity: +caseQuantity,
               minOrderValue: +minOrderValue,
               leadTime: { unit: leadTimeUnit, value: leadTime },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="More Item Information"
            close={() => close(2)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="unitQty" title="unitQuantity">
                     Unit qty (in pieces)
                  </Form.Label>
                  <Form.Number
                     id="unitQty"
                     placeholder="Unit qty (in pieces)"
                     name="unitQty"
                     value={unitQuantity}
                     onChange={e => setUnitQuantity(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label htmlFor="unitPrice" title="unitPrice">
                     Unit Price
                  </Form.Label>
                  <Form.Number
                     id="unitPrice"
                     placeholder="Unit Price"
                     name="unitPrice"
                     value={unitPrice}
                     onChange={e => setUnitPrice(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>

            <Spacer size="16px" />

            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="caseQty" title="caseQty">
                     Case qty (in pieces)
                  </Form.Label>
                  <Form.Number
                     id="caseQty"
                     placeholder="Case qty (in pieces)"
                     name="caseQty"
                     value={caseQuantity}
                     onChange={e => setCaseQuantity(e.target.value)}
                  />
               </Form.Group>

               <Form.Group>
                  <Form.Label htmlFor="unitPrice" title="unitPrice">
                     Min. value order (in case)
                  </Form.Label>
                  <Form.Number
                     id="unitPrice"
                     placeholder="Min. value order (in case)"
                     name="unitPrice"
                     value={minOrderValue}
                     onChange={e => setMinOrderValue(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>

            <Spacer size="16px" />
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="leadTime" title="leadTime">
                     Lead time
                  </Form.Label>

                  <Form.TextSelect>
                     <Form.Number
                        id="leadTime"
                        placeholder="Lead time"
                        name="leadTime"
                        value={leadTime}
                        onChange={e => setLeadTime(e.target.value)}
                     />

                     <Form.Select
                        id="unit"
                        name="unit"
                        defaultValue={leadTimeUnit}
                        onChange={e => setLeadTimeUnit(e.target.value)}
                        options={[
                           { id: 1, title: 'days' },
                           { id: 2, title: 'hours' },
                        ]}
                     />
                  </Form.TextSelect>
               </Form.Group>
            </StyledInputGroup>
         </TunnelContainer>
      </>
   )
}
