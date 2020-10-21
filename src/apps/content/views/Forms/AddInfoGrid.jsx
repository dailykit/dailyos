import React from 'react'
import { toast } from 'react-toastify'
import { useMutation} from '@apollo/react-hooks'
import { Form, Spacer,TextButton ,Text} from '@dailykit/ui'
import { StyledWrapper} from '../Listings/styled'
import { Flex } from '../../../../shared/components'
import { INSERT_INFO_GRID} from '../../graphql'


export const AddInfoGrid = () => {


    const [form, setForm] = React.useState({
        heading: '', 
        subHeading: '',
        page:'',
        identifier:''
     })

     const [ insert_content_informationGrid_one]  = useMutation(INSERT_INFO_GRID, {
        onCompleted: () => toast.success('Created succesfully!'),
        // onError: () => toast.error('Failed to create!'),
        onError: error => console.log(error),

     })
     

    const onClick = React.useCallback(()=> {
        if(!form.heading || !form.subHeading) return toast.error('Please provide proper inputs!')
        insert_content_informationGrid_one({
                 variables : { object : { 
                    heading : form.heading,
                    subHeading : form.subHeading, 
                    page : form.page, 
                    identifier : form.identifier
                  }}})},[form.heading,form.subHeading,form.page,form.identifier]   
     ) 

    return (
        <StyledWrapper>
            <div>
            <Flex padding="30px" >
            <Spacer size='64x' />
            <Text as='h1'>Add New Information Grid</Text>
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
            <Form.Group>
            <Form.Label>Page*</Form.Label>
            <Form.Text
                id='page'
                name="page"
                value={form.page}
                onChange={e => setForm({
                    ...form, page:e.target.value})}
                placeholder="Enter page option..."
            />
            </Form.Group>
            <Spacer size='32px' />
            <Form.Group>
            <Form.Label>Identifier*</Form.Label>
            <Form.Text
                id='identifier'
                name="identifier"
                value={form.identifier}
                onChange={e => setForm({
                    ...form, identifier:e.target.value})}
                placeholder="Enter identifier..."
            />
            </Form.Group>
            </Flex>
            </div>
      </StyledWrapper>
    )
}
