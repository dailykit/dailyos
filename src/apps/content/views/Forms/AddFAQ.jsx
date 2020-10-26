import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { Form, Spacer, TextButton, Text } from '@dailykit/ui'
import { Flex, Tooltip } from '../../../../shared/components'
import { INSERT_INFO_FAQ } from '../../graphql'

export const AddFAQ = () => {
   const [form, setForm] = React.useState({
      heading: '',
      subHeading: '',
      page: '',
      identifier: '',
   })

   const [insert_content_faqs_one] = useMutation(INSERT_INFO_FAQ, {
      onCompleted: () => toast.success('Created succesfully!'),
      onError: () => toast.error('Failed to create!'),
   })

   const onClick = React.useCallback(() => {
      if (!form.heading || !form.subHeading || !form.page || !form.identifier)
         return toast.error('Please provide proper inputs!')
      insert_content_faqs_one({
         variables: {
            object: {
               heading: form.heading,
               subHeading: form.subHeading,
               page: form.page,
               identifier: form.identifier,
            },
         },
      })
   }, [form.heading, form.subHeading, form.page, form.identifier])
   const [page] = React.useState([
      { id: 1, title: 'Select Page' },
      { id: 2, title: 'home' },
      { id: 3, title: 'select-plan' },
   ])
   const [identifier] = React.useState([
      { id: 1, title: 'Select Identifier' },
      { id: 2, title: 'bottom-01' },
   ])
   return (
      <Flex maxWidth="1280px" width="calc(100vw - 64px)" margin="0 auto">
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container alignItems="center">
               <Text as="h2">Add New FAQ</Text>
               <Tooltip identifier="faq_form_heading" />
            </Flex>
            <TextButton type="solid" onClick={onClick}>
               Save
            </TextButton>
         </Flex>
         <Form.Group>
            <Form.Label htmlFor="heading" title="heading">
               Heading*
            </Form.Label>
            <Form.Text
               id="heading"
               name="heading"
               value={form.heading}
               onChange={e =>
                  setForm({
                     ...form,
                     heading: e.target.value,
                  })
               }
               placeholder="Enter Heading..."
            />
         </Form.Group>
         <Spacer size="32px" />
         <Form.Group>
            <Form.Label>Sub Heading*</Form.Label>
            <Form.TextArea
               id="subHeading"
               name="subHeading"
               value={form.subHeading}
               onChange={e =>
                  setForm({
                     ...form,
                     subHeading: e.target.value,
                  })
               }
               placeholder="Enter Sub Heading..."
            />
         </Form.Group>
         <Spacer size="32px" />
         <Form.Group>
            <Form.Label>Page*</Form.Label>
            <Form.Select
               id="page"
               name="page"
               options={page}
               onChange={e =>
                  setForm({
                     ...form,
                     page: e.target.value,
                  })
               }
               placeholder="Enter page option..."
               defaultValue={page[1]}
            />
         </Form.Group>
         <Spacer size="32px" />
         <Form.Group>
            <Form.Label>Identifier*</Form.Label>
            <Form.Select
               id="identifier"
               name="identifier"
               options={identifier}
               onChange={e =>
                  setForm({
                     ...form,
                     identifier: e.target.value,
                  })
               }
               placeholder="Enter identifier..."
               defaultValue={identifier[1]}
            />
         </Form.Group>
      </Flex>
   )
}
