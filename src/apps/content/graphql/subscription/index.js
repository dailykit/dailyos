import gql from 'graphql-tag'

export const FAQS = gql`
   subscription FAQS {
      content_faqs(where: { isArchived: { _eq: false } }) {
         id
         heading
         subHeading
      }
   }
`

export const INFORMATION_GRID = gql`
   subscription INFORMATION_GRID {
      content_informationGrid(where: { isArchived: { _eq: false } }) {
         id
         heading
         subHeading
      }
   }
`

export const INFO_GRID_ONE = gql`
   subscription INFO_GRID_ONE($id: Int!) {
      content_informationGrid(where: { id: { _eq: $id } }) {
         id
         heading
         subHeading
         page
         identifier
      }
   }
`
export const FAQ_ONE = gql`
   subscription FAQ_ONE($id: Int!) {
      content_faqs(where: { id: { _eq: $id } }) {
         id
         subHeading
         heading
         page
         identifier
      }
   }
`

export const INFO_COUNT = gql`
   subscription INFO_COUNT {
      content_informationGrid_aggregate {
         aggregate {
            count
         }
      }
   }
`
