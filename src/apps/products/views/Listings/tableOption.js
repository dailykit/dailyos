const options = {
   cellVertAlign: 'middle',
   layout: 'fitColumns',
   autoResize: true,
   maxHeight: 420,
   resizableColumns: false,
   virtualDomBuffer: 20,
   persistenceID: 'recipe_table',
   placeholder: 'No Data Available',
   persistence: true,
   persistenceMode: 'local',
   selectablePersistence: true,
   persistence: {
      group: {
         groupBy: true, //persist only the groupBy setting
         groupStartOpen: true,
         groupHeader: true,
      },
      sort: true, //persist column sorting
      filter: true, //persist filter sorting
      // group: true, //persist row grouping
      page: true, //persist page
      columns: true, //persist columns
   },
   movableColumns: true,
   tooltips: true,
}

export default options
