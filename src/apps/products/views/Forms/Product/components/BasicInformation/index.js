import React from 'react'
import { Flex, Form, Spacer, Text } from '@dailykit/ui'
import { StyledFlex } from '../../styled'
import Pricing from '../Pricing'
import Assets from '../Assets'
import { useMutation } from '@apollo/react-hooks'
import { PRODUCT } from '../../../../../graphql'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import Description from './Description'
import { UpdatingSpinner } from '../../../../../../../shared/components'

const BasicInformation = ({ state }) => {
   const [updated, setUpdated] = React.useState(null)
   const [additionalText, setAdditionalText] = React.useState({
      value: state.additionalText || '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })

   // Mutations
   const [
      updateAdditionalText,
      { loading: updatingAdditionalText },
   ] = useMutation(PRODUCT.UPDATE, {
      variables: {
         id: state.id,
         _set: {
            additionalText: additionalText.value,
         },
      },
      onCompleted: () => {
         setUpdated('additional-text')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   React.useEffect(() => {
      const timeId = setTimeout(() => {
         setUpdated(null)
      }, 1800)
      return () => {
         clearTimeout(timeId)
      }
   }, [updated])

   return (
      <Flex padding="40px 0px 0px 0px">
         <Text as="h2">Basic Information</Text>
         <Spacer yAxis size="30px" />
         <Flex container alignItems="center">
            <div style={{ width: '100%' }}>
               <Form.Group>
                  <Form.Text
                     id="text"
                     name="text"
                     variant="revamp-sm"
                     onChange={e => {
                        setAdditionalText({
                           ...additionalText,
                           value: e.target.value,
                        })
                     }}
                     onBlur={updateAdditionalText}
                     value={additionalText.value}
                     placeholder="enter additional text, this will be shown with name on store"
                  />
               </Form.Group>
            </div>
            <UpdatingSpinner
               loading={updatingAdditionalText}
               setUpdated={setUpdated}
               updated={updated}
               updatedField="additional-text"
            />
         </Flex>
         <Spacer size="16px" />

         <StyledFlex
            as="section"
            container
            alignItems="start"
            justifyContent="space-between"
            padding="40px 0px 0px 0px"
         >
            <Flex width="100%" padding="0px 16px 0px 0px">
               <Pricing state={state} />
               <Description state={state} />
            </Flex>
            <Assets state={state} />
         </StyledFlex>
      </Flex>
   )
}

export default BasicInformation
