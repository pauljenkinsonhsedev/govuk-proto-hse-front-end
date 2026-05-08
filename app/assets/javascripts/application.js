window.GOVUKPrototypeKit.documentReady(() => {
  const select = document.querySelector('#country')

  if (select && window.accessibleAutocomplete) {
    window.accessibleAutocomplete.enhanceSelectElement({
      selectElement: select,
      showAllValues: true,
      defaultValue: '',
      displayMenu: 'overlay'
    })
  }
})