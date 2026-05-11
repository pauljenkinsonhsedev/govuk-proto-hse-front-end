window.GOVUKPrototypeKit.documentReady(() => {
  const selects = document.querySelectorAll('select[data-module="autocomplete"]')
  
  selects.forEach((select) => {
    if (window.accessibleAutocomplete) {
      try {
        window.accessibleAutocomplete.enhanceSelectElement({
          selectElement: select,
          showAllValues: true,
          minLength: 0,
          displayMenu: 'overlay',
          defaultValue: ''
        })
      } catch (err) {
        console.error('Autocomplete failed for', select.id, err)
      }
    }
  })
})