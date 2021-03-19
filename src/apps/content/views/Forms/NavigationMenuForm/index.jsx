import React, { useState, useEffect, useContext, useRef } from 'react'
import { Flex, Form, Spacer, ComboButton, PlusIcon } from '@dailykit/ui'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { TreeView } from './components'
import { StyledWrapper, InputWrapper, StyledDiv, Highlight } from './styles'
import {
   NAVIGATION_MENU_INFO,
   UPDATE_NAVIGATION_MENU,
   INSERT_NAVIGATION_MENU_ITEM,
   UPDATE_NAVIGATION_MENU_ITEM,
   DELETE_NAVIGATION_MENU_ITEM,
} from '../../../graphql'
import BrandContext from '../../../context/Brand'
import NavMenuContext from '../../../context/NavMenu'
import { useTabs } from '../../../../../shared/providers'
import { logger, randomSuffix } from '../../../../../shared/utils'
import { Tooltip, InlineLoader } from '../../../../../shared/components'

const NavigationMenuForm = () => {
   const { addTab, tab, setTabTitle, closeAllTabs } = useTabs()
   const [context, setContext] = useContext(BrandContext)
   const [navMenuContext, setNavMenuContext] = useContext(NavMenuContext)
   const { brandId } = context
   const prevBrandId = useRef(brandId)
   const { menuId } = useParams()
   const [menuTitle, setMenuTitle] = useState({
      value: '',
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
      },
   })
   const [navbarMenuItems, setNavbarMenuItems] = useState([])
   const [toggle, setToggle] = useState(false)

   // form validation
   const validatePageName = (value, name) => {
      const text = value.trim()
      let isValid = true
      let errors = []
      if (name === 'menuTitle') {
         if (text.length < 2) {
            isValid = false
            errors = [...errors, 'Must have atleast two letters.']
         }
      } else {
         if (text.length < 1) {
            isValid = false
            errors = [...errors, 'Must have atleast one letters.']
         }
         if (!text.includes('/')) {
            isValid = false
            errors = [...errors, 'Invalid route!Must start with ' / '.']
         }
      }
      return { isValid, errors }
   }

   // Subscription
   const { loading: menuLoading, error: menuError } = useSubscription(
      NAVIGATION_MENU_INFO,
      {
         variables: {
            menuId,
         },
         onSubscriptionData: ({
            subscriptionData: {
               data: { website_navigationMenuItem: menuItems = [] } = {},
            } = {},
         }) => {
            console.log('from subscription', menuItems)
            // setNavbarMenuItems(menuItems)
            setMenuTitle({
               ...menuTitle,
               value: menuItems[0]?.navigationMenu?.title || tab?.title,
            })
            setToggle(menuItems[0]?.navigationMenu.isPublished)

            const createDataTree = dataset => {
               const hashTable = Object.create(null)
               dataset.forEach(
                  aData => (hashTable[aData.id] = { ...aData, childNodes: [] })
               )
               const dataTree = []
               dataset.forEach(aData => {
                  if (aData.parentNavigationMenuItemId)
                     hashTable[
                        aData.parentNavigationMenuItemId
                     ].childNodes.push(hashTable[aData.id])
                  else dataTree.push(hashTable[aData.id])
               })
               return dataTree
            }

            setNavbarMenuItems(createDataTree(menuItems))
         },
      }
   )

   // Mutation for page publish toggle
   const [createMenuItem] = useMutation(INSERT_NAVIGATION_MENU_ITEM, {
      onCompleted: () => {
         toast.success('Menu Item created!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })
   // Mutation for updating  menu item
   const [updateMenuItem] = useMutation(UPDATE_NAVIGATION_MENU_ITEM, {
      onCompleted: () => {
         toast.success('Menu Item updated!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })
   // Mutation for deleting menu item
   const [deleteMenuItem] = useMutation(DELETE_NAVIGATION_MENU_ITEM, {
      onCompleted: () => {
         toast.success('Menu Item deleted!')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   // Mutation for page publish toggle
   const [updateMenu] = useMutation(UPDATE_NAVIGATION_MENU, {
      onCompleted: () => {
         toast.success('Updated!')
         setTabTitle(menuTitle.value)
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })

   // toggle handler
   const updatetoggle = () => {
      const val = !toggle
      updateMenu({
         variables: {
            menuId,
            _set: {
               isPublished: val,
            },
         },
      })
   }

   // create menu Item handler
   const createMenuItemHandler = () => {
      createMenuItem({
         variables: {
            label: `label-${randomSuffix()}`,
            navigationMenuId: menuId,
         },
      })
   }

   // page name validation & update name handler
   const onBlur = e => {
      if (e.target.name === 'menuTitle') {
         setMenuTitle({
            ...menuTitle,
            meta: {
               ...menuTitle.meta,
               isTouched: true,
               errors: validatePageName(e.target.value, e.target.name).errors,
               isValid: validatePageName(e.target.value, e.target.name).isValid,
            },
         })
         if (
            validatePageName(e.target.value, e.target.name).isValid &&
            validatePageName(e.target.value, e.target.name).errors.length === 0
         ) {
            updateMenu({
               variables: {
                  menuId,
                  _set: {
                     title: e.target.value,
                  },
               },
            })
         }
      }
   }

   useEffect(() => {
      if (!tab) {
         addTab('Pages', '/content/pages')
      }
   }, [addTab, tab])

   if (brandId !== prevBrandId.current) {
      closeAllTabs()
   }

   if (menuLoading) {
      return <InlineLoader />
   }
   if (menuError) {
      toast.error('Something went wrong hereee')
      logger(menuError)
   }
   return (
      <StyledWrapper>
         <InputWrapper>
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               padding="0 0 16px 0"
            >
               <Form.Group>
                  <Flex container alignItems="flex-end">
                     <Form.Label htmlFor="name" title="Page Name">
                        Menu Title*
                     </Form.Label>
                     <Tooltip identifier="navigation_menu_info" />
                  </Flex>
                  <Form.Text
                     id="menuTitle"
                     name="menuTitle"
                     value={menuTitle.value}
                     placeholder="Enter the Page Name "
                     onBlur={onBlur}
                     onChange={e =>
                        setMenuTitle({
                           ...menuTitle,
                           value: e.target.value,
                        })
                     }
                  />
                  {menuTitle.meta.isTouched &&
                     !menuTitle.meta.isValid &&
                     menuTitle.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               <Flex container alignItems="center" height="100%">
                  {/* <Highlight onClick={() => openTunnel(1)}>
                     Preview Page
                  </Highlight> */}
                  {/* {state.isCouponValid?.status ? (
                        <>
                           <TickIcon color="#00ff00" stroke={2} />
                           <Text as="p">All good!</Text>
                        </>
                     ) : (
                        <>
                           <CloseIcon color="#ff0000" />
                           <Text as="p">{state.isCouponValid?.error}</Text>
                        </>
                     )} */}
                  <Spacer xAxis size="24px" />
                  <Form.Toggle
                     name="page_published"
                     onChange={updatetoggle}
                     value={toggle}
                  >
                     <Flex container alignItems="center">
                        Publish
                        <Tooltip identifier="navigation_menu_publish_info" />
                     </Flex>
                  </Form.Toggle>
               </Flex>
            </Flex>
         </InputWrapper>
         <StyledDiv>
            <TreeView
               data={navbarMenuItems}
               createMenuItem={createMenuItem}
               updateMenuItem={updateMenuItem}
               deleteMenuItem={deleteMenuItem}
               menuId={menuId}
            />
            {/* {navbarMenuItems.map(item => {
               return (
                  <MenuItem
                     key={item.id}
                     createMenuItem={createMenuItem}
                     updateMenuItem={updateMenuItem}
                     deleteMenuItem={deleteMenuItem}
                     menuId={menuId}
                     menuItem={item}
                  />
               )
            })} */}
            <ComboButton
               type="outline"
               size="sm"
               onClick={createMenuItemHandler}
            >
               <PlusIcon />
               Add menu item
            </ComboButton>
         </StyledDiv>
      </StyledWrapper>
   )
}

export default NavigationMenuForm
