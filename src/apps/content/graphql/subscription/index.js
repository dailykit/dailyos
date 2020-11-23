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
export const INFORMATION_BLOCK = gql`
   query INFORMATION_BLOCK($faqId: Int, $gridId: Int) {
      content_informationBlock(
         where: { faqsId: { _eq: $faqId }, informationGridId: { _eq: $gridId } }
      ) {
         description
         id
         thumbnail
         title
      }
   }
`
export const CONTENT_PAGE = gql`
   subscription CONTENT_PAGE {
      content_page {
         title
         description
         identifiers {
            title
         }
      }
   }
`
export const CONTENT_PAGE_ONE = gql`
   subscription CONTENT_PAGE_ONE($page: String!) {
      content_page_by_pk(title: $page) {
         title
         description
         identifiers {
            identifier: title
         }
      }
   }
`
