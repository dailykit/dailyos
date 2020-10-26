import React from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Form, Spacer, TextButton, Text } from '@dailykit/ui'
import { UPDATE_INFO_FAQ, FAQ_ONE } from '../../graphql'
import { InlineLoader, Flex, Tooltip } from '../../../../shared/components'

export const FAQS = () => {
   const { id } = useParams()

   const [form, setForm] = React.useState({
      heading: '',
      subHeading: '',
      page: '',
      identifier: '',
   })

   const { loading, error } = useSubscription(FAQ_ONE, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         if (data?.content_faqs.length > 0) {
            setForm({
               heading: data.content_faqs[0].heading,
               subHeading: data.content_faqs[0].subHeading,
               page: data.content_faqs[0].page,
               identifier: data.content_faqs[0].identifier,
            })
         }
      },
   })

   const [update_content_faqs] = useMutation(UPDATE_INFO_FAQ, {
      onCompleted: () => toast.success('Successfully updated!'),
      // onError: () => toast.error('Failed to update!'),
      onError: error => console.log(error),
   })

   const onClick = React.useCallback(() => {
      if (!form.heading || !form.subHeading || !form.page || !form.identifier)
         return toast.error('Please provide proper inputs!')
      update_content_faqs({
         variables: {
            id,
            heading: form.heading,
            subHeading: form.subHeading,
            page: form.page,
            identifier: form.identifier,
         },
      })
   }, [id, form.heading, form.subHeading, form.page, form.identifier])
   const [page] = React.useState([
      { id: 1, title: 'home' },
      { id: 2, title: 'select-plan' },
   ])

   const [identifier] = React.useState([{ id: 1, title: 'bottom-01' }])

   if (loading) return <InlineLoader />
   if (error) return `${error.message}`
   return (
      <Flex maxWidth="1280px" width="calc(100vw - 64px)" margin="0 auto">
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            height="72px"
         >
            <Flex container alignItems="center">
               <Text as="h2">Edit FAQ</Text>
               <Tooltip identifier="faq_edit_form" />
            </Flex>
            <TextButton type="solid" onClick={onClick}>
               Save
            </TextButton>
         </Flex>

         <Spacer size="20px" />
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
               value={form.page}
               onChange={e =>
                  setForm({
                     ...form,
                     page: e.target.value,
                  })
               }
               placeholder="Enter page option..."
            />
         </Form.Group>
         <Spacer size="32px" />
         <Form.Group>
            <Form.Label>Identifier*</Form.Label>
            <Form.Select
               id="identifier"
               name="identifier"
               options={identifier}
               value={form.identifier}
               onChange={e =>
                  setForm({
                     ...form,
                     identifier: e.target.value,
                  })
               }
               placeholder="Enter identifier..."
            />
         </Form.Group>
      </Flex>
   )
}
