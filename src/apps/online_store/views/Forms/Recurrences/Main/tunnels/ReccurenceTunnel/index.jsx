import React from 'react'
import { Text, TextButton, Checkbox } from '@dailykit/ui'
import { RRule } from 'rrule'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody } from '../styled'
import { Context } from '../../../../../../context/tabs'
import { Container, Flex } from '../../../styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { CREATE_RECURRENCE } from '../../../../../../graphql/mutations'

const ReccurenceTunnel = ({ closeTunnel }) => {
   const { state: tabs } = React.useContext(Context)
   const [busy, setBusy] = React.useState(false)
   const [daily, setDaily] = React.useState(false)
   const [days, setDays] = React.useState([])

   // Mutation
   const [createRecurrence] = useMutation(CREATE_RECURRENCE, {
      onCompleted: () => {
         toast.success('Recurrence added!')
         closeTunnel(1)
      },
      onError: error => {
         setBusy(false)
         toast.error('Error')
         console.log(error)
      },
   })

   // Handlers
   const save = () => {
      setBusy(true)
      let rrule = ''
      if (daily) {
         rrule = new RRule({
            freq: RRule.DAILY,
         })
      } else {
         rrule = new RRule({
            freq: RRule.WEEKLY,
            byweekday: days,
         })
      }
      createRecurrence({
         variables: {
            object: {
               rrule: rrule.toString(),
               type: tabs.current.fulfillment,
            },
         },
      })
   }

   const toggleDay = (val, day) => {
      if (val) {
         setDays([...days, day])
      } else {
         setDays(days.filter(el => el !== day))
      }
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(1)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Reccurence</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Container bottom="32">
               <Text as="p">Select the days: </Text>
            </Container>
            <Container bottom="16">
               <Checkbox checked={daily} onChange={val => setDaily(val)}>
                  Daily
               </Checkbox>
            </Container>
            {!daily && (
               <>
                  <Container bottom="12">
                     <Text as="subtitle">Or select specific days:</Text>
                  </Container>
                  <Flex direction="row">
                     <Checkbox
                        checked={days.includes(RRule.MO)}
                        onChange={val => toggleDay(val, RRule.MO)}
                     >
                        Monday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.TU)}
                        onChange={val => toggleDay(val, RRule.TU)}
                     >
                        Tuesday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.WE)}
                        onChange={val => toggleDay(val, RRule.WE)}
                     >
                        Wednesday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.TH)}
                        onChange={val => toggleDay(val, RRule.TH)}
                     >
                        Thursday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.FR)}
                        onChange={val => toggleDay(val, RRule.FR)}
                     >
                        Friday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.SA)}
                        onChange={val => toggleDay(val, RRule.SA)}
                     >
                        Saturday
                     </Checkbox>
                     <Checkbox
                        checked={days.includes(RRule.SU)}
                        onChange={val => toggleDay(val, RRule.SU)}
                     >
                        Sunday
                     </Checkbox>
                  </Flex>
               </>
            )}
         </TunnelBody>
      </React.Fragment>
   )
}

export default ReccurenceTunnel
