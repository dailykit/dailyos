import gql from 'graphql-tag'

export const FAQS = gql`
   subscription MyQuery {
      content_faqs {
         id
         heading
         subHeading
      }
   }
`

export const INFORMATION_GRID = gql`
   subscription MyQuery {
      content_informationGrid {
         id
         heading
         subHeading
      }
   }
`

export const INFO_GRID_ONE = gql`
   subscription MyQuery($id: Int!) {
      content_informationGrid(where: { id: { _eq: $id } }) {
         id
         heading
         subHeading
         page
         identifier
      }
   }
`
export const UPDATE_INFO_GRID = gql`
   mutation MyMutation(
      $id: Int!
      $heading: String!
      $subHeading: String!
      $page: String!
      $identifier: String!
   ) {
      update_content_informationGrid(
         where: { id: { _eq: $id } }
         _set: {
            heading: $heading
            subHeading: $subHeading
            page: $page
            identifier: $identifier
         }
      ) {
         returning {
            heading
            subHeading
            page
            identifier
         }
      }
   }
`

export const FAQ_ONE = gql`
   subscription MyQuery($id: Int!) {
      content_faqs(where: { id: { _eq: $id } }) {
         id
         subHeading
         heading
         page
         identifier
      }
   }
`
export const UPDATE_INFO_FAQ = gql`
   mutation MyMutation(
      $id: Int!
      $heading: String!
      $subHeading: String!
      $page: String!
      $identifier: String!
   ) {
      update_content_faqs(
         where: { id: { _eq: $id } }
         _set: {
            heading: $heading
            subHeading: $subHeading
            page: $page
            identifier: $identifier
         }
      ) {
         returning {
            heading
            subHeading
            page
            identifier
         }
      }
   }
`
export const INSERT_INFO_FAQ = gql`
   mutation MyMutation($object: content_faqs_insert_input!) {
      insert_content_faqs_one(object: $object) {
         id
      }
   }
`

export const INSERT_INFO_GRID = gql`
   mutation MyMutation($object: content_informationGrid_insert_input!) {
      insert_content_informationGrid_one(object: $object) {
         id
      }
   }
`

export const INFO_COUNT = gql`
   subscription MySubscription {
      content_informationGrid_aggregate {
         aggregate {
            count
         }
      }
   }
`
