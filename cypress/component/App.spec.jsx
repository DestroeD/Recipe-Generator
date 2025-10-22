import React from 'react'
import App from '../../src/App.jsx'

describe('<App />', () => {
  it('renders correctly', () => {
    cy.mount(<App />)
    cy.contains('Vite + React').should('exist')
  })
})
