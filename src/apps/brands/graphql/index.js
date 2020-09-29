import gql from 'graphql-tag'

export const BRANDS = {
   AGGREGATE: gql`
      subscription brands {
         brandsAggregate {
            aggregate {
               count
            }
         }
      }
   `,
   LIST: gql`
      subscription brands {
         brands: brandsAggregate {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               domain
               title
               isPublished
            }
         }
      }
   `,
   BRAND: gql`
      subscription brand($id: Int!) {
         brand(id: $id) {
            id
            domain
            title
            isDefault
            isPublished
         }
      }
   `,
   UPDATE_BRAND: gql`
      mutation updateBrand($id: Int!, $_set: brands_brand_set_input!) {
         updateBrand(pk_columns: { id: $id }, _set: $_set) {
            id
         }
      }
   `,
   ON_DEMAND_SETTINGS_TYPES: gql`
      subscription brandOnDemandSettings {
         brandOnDemandSettings: brands_brand_storeSetting {
            onDemandSetting {
               id
               type
               identifier
            }
         }
      }
   `,
   UPDATE_ONDEMAND_SETTING: gql`
      mutation updateOnDemandSetting(
         $pk_columns: brands_brand_storeSetting_pk_columns_input!
         $_set: brands_brand_storeSetting_set_input = {}
      ) {
         updateOnDemandSetting: update_brands_brand_storeSetting_by_pk(
            pk_columns: $pk_columns
            _set: $_set
         ) {
            brandId
            storeSettingId
         }
      }
   `,
   ONDEMAND_SETTING: gql`
      subscription onDemandSetting(
         $identifier: String_comparison_exp!
         $type: String_comparison_exp!
         $brandId: Int_comparison_exp!
      ) {
         onDemandSetting: brands_brand_storeSetting(
            where: {
               onDemandSetting: { identifier: $identifier, type: $type }
               brandId: $brandId
            }
         ) {
            value
            storeSettingId
         }
      }
   `,
}
