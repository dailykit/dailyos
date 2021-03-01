const fetchCall = async body => {
   const response = await fetch(process.env.REACT_APP_DATA_HUB_URI, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'x-hasura-admin-secret':
            process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: body,
   })
   const data = await response.json()
   return await data
}

export default fetchCall
