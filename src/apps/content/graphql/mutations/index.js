import gql from 'graphql-tag'

export const ADD_INFO_GRID = gql`
   mutation MyMutation($object: content_informationGrid_insert_input!) {
      insert_content_informationGrid_one(object: $object) {
         id
         heading
      }
   }
`
export const UPDATE_INFO_GRID = gql`
   mutation MyMutation($id: Int!, $set: content_informationGrid_set_input!) {
      update_content_informationGrid(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            heading
            subHeading
            page
            identifier
         }
      }
   }
`

export const UPDATE_INFO_FAQ = gql`
   mutation MyMutation($id: Int!, $set: content_faqs_set_input!) {
      update_content_faqs(where: { id: { _eq: $id } }, _set: $set) {
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
export const GRID_ARCHIVED = gql`
   mutation GRID_ARCHIVED($id: Int!) {
      update_content_informationGrid(
         where: { id: { _eq: $id } }
         _set: { isArchived: true }
      ) {
         returning {
            id
            isArchived
         }
      }
   }
`
export const FAQ_ARCHIVED = gql`
   mutation FAQ_ARCHIVED($id: Int!) {
      update_content_faqs(
         where: { id: { _eq: $id } }
         _set: { isArchived: true }
      ) {
         returning {
            id
            isArchived
         }
      }
   }
`
export const WEBPAGE_ARCHIVED = gql`
   mutation WEBPAGE_ARCHIVED($websiteId: Int!, $pageId: Int!) {
      update_website_websitePage(
         where: { websiteId: { _eq: $websiteId }, id: { _eq: $pageId } }
         _set: { isArchived: true }
      ) {
         returning {
            internalPageName
            id
            route
         }
      }
   }
`
