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

export const UPDATE_WEBPAGE = gql`
   mutation UPDATE_WEBPAGE(
      $pageId: Int!
      $set: website_websitePage_set_input!
   ) {
      update_website_websitePage_by_pk(
         pk_columns: { id: $pageId }
         _set: $set
      ) {
         internalPageName
         published
         route
         id
      }
   }
`
export const LINK_COMPONENT = gql`
   mutation LINK_COMPONENT(
      $objects: [website_websitePageModule_insert_input!]!
   ) {
      insert_website_websitePageModule(objects: $objects) {
         returning {
            fileId
            websitePageId
            moduleType
            templateId
            internalModuleIdentifier
         }
      }
   }
`
export const UPDATE_LINK_COMPONENT = gql`
   mutation UPDATED_LINK_COMPONENT(
      $websitePageModuleId: Int!
      $_set: website_websitePageModule_set_input!
   ) {
      update_website_websitePageModule(
         where: { id: { _eq: $websitePageModuleId } }
         _set: $_set
      ) {
         returning {
            config
            id
         }
      }
   }
`
export const DELETE_LINKED_COMPONENT = gql`
   mutation DELETE_LINKED_COMPONENT(
      $where: website_websitePageModule_bool_exp!
   ) {
      delete_website_websitePageModule(where: $where) {
         returning {
            fileId
            id
         }
      }
   }
`
export const CREATE_WEBPAGE = gql`
   mutation CREATE_WEBPAGE($object: website_websitePage_insert_input!) {
      insert_website_websitePage_one(object: $object) {
         id
         internalPageName
      }
   }
`
export const INSERT_SUBSCRIPTION_FOLD = gql`
mutation INSERT_SUBSCRIPTION_FOLDS($fileId: Int!, $identifier: String!) {
   insert_content_subscriptionDivIds(objects: {fileId: $fileId, id: $identifier}, on_conflict: {constraint: subscriptionDivIds_pkey, update_columns: fileId}) {
     returning {
       identifier: id
       fileId
     }
   }
 }
`
export const DELETE_SUBSCRIPTION_FOLD  = gql`
mutation DELETE_SUBSCRIPTION_FOLD($identifier: String!, $fileId: Int!) {
   delete_content_subscriptionDivIds(where: {id: {_eq: $identifier}, fileId: {_eq: $fileId}}) {
     returning {
       fileId
       id
     }
   }
 }

`