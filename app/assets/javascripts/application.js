window.GOVUKPrototypeKit.documentReady(() => {
  const selects = document.querySelectorAll('select[data-module="autocomplete"]')
  
  selects.forEach((select) => {
    if (window.accessibleAutocomplete) {
      window.accessibleAutocomplete.enhanceSelectElement({
        selectElement: select,
        showAllValues: true,
        displayMenu: 'overlay'
      })
    }
  })
})