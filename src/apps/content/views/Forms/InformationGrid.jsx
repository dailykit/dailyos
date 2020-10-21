import React from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Form, Spacer,TextButton } from '@dailykit/ui'
import {INFO_GRID_ONE,UPDATE_INFO_GRID} from '../../graphql'
import { InlineLoader,Flex } from '../../../../shared/components'
import { StyledWrapper} from '../Listings/styled'

export const InformationGrid = () => {
const  { id } = useParams()

const [form, setForm] = React.useState({
   heading: '', 
   subHeading: '',
})

const {loading, error} = useSubscription(INFO_GRID_ONE,{
        variables : { id },
      onSubscriptionData : ({ subscriptionData : { data = {} } = {} } ) => {
         if(data?.content_informationGrid.length>0)
         {
         setForm({heading : data.content_informationGrid[0].heading, subHeading : data.content_informationGrid[0].subHeading})
         }         
      }
   })

const [update_content_informationGrid] = useMutation(UPDATE_INFO_GRID, {
   onCompleted: () => toast.success('Successfully updated!'),
   onError: () => toast.error('Failed to update!'),
})

const onClick = React.useCallback(()=> {
   if(!form.heading || !form.subHeading) return toast.error('Please provide proper inputs!')
   update_content_informationGrid({
            variables: { id,heading : form.heading,subHeading : form.subHeading
             }})},[id,form.heading,form.subHeading]   
)

if(loading) return <InlineLoader/>
if (error) return `${error.message}`
    return(
      <StyledWrapper>
         <div>
      <Flex padding="30px" >
      <Spacer size='64x' />
      <div align='right'>
         <TextButton type='solid' onClick={onClick}>Save</TextButton>
      </div>
      <Spacer size='20px' />
      <Form.Group>
      <Form.Label htmlFor='heading' title='heading'>Heading*</Form.Label>
      <Form.Text
         id='heading'
         name="heading"
         value={form.heading}
         onChange={e => setForm({
            ...form , heading:e.target.value})}
         placeholder="Enter Heading..."
      />
      </Form.Group>
      <Spacer size='32px' />
      <Form.Group>
      <Form.Label>Sub Heading*</Form.Label>
      <Form.TextArea
         id='subHeading'
         name="subHeading"
         value={form.subHeading}
         onChange={e => setForm({
            ...form, subHeading:e.target.value})}
         placeholder="Enter Sub Heading..."
      />
      </Form.Group>
      <Spacer size='32px' />
      </Flex>
      </div>
      </StyledWrapper>
    )
}