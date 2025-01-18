import { test, expect} from '@playwright/test'


// init config
const test_config = {
    url: 'https://www.esky.pl/',
    accept_cookies: '.sc-dcJsrY.MsFWE'
}

// data used in test
const test_data = {
    departure_place: 'Warszawa', //customizable
    destination_place: 'Poznan', //customizable
    departure_date: '2025-01-24', //not customizable yet
    return_date: '2025-01-31', //not customizable yet
    passenger_number: '2' //not customizable yet

}

//placeholder for now
const fly_requirements = {
    direct_fly_only: true,
    max_price: 2000,
    latest_arrival: '18:00'
}

// selectors ids/classes used in test
const selectors = {
    departure_place_selector: '#departureRoundtrip0',
    destination_selector: '#arrivalRoundtrip0',
    departure_date: '#departureDateRoundtrip0',
    return_date: '#departureDateRoundtrip1',
    passengers_dropdown: '.wrap.pax-widget.custom-dropdown',
    search_button: '.btn.transaction.qsf-search'

}

// function that check if direct fly checkbox is available and if so - activate that filter.
async function direct_fly_check_activate(page) {
    const direct_fly = await page.getByTestId('None').getByText('Lot bezpośredni').isEnabled() 

    if (direct_fly) {
        console.log('Lot bezposredni jest dostepny')
        await page.getByTestId('None').getByText('Lot bezpośredni').check()
        
    }
    else {
        console.log('Lot bezposredni nie jest dostepny')
    }
    
}
//function that return co2 emission number for cheapest fly appeared.
async function check_emission(page) {
    const co2_emission_text = await page.locator('.emission-label').first().textContent()

    const co2EmissionNumber = co2_emission_text.replace(/\D/g, '').slice(1) //first "2" number is removed because replace method include that from text "co2" < we don't want that number

    console.log(`Emisja co2 najtanszych biletów wyniesie: ${co2EmissionNumber} kg`)
}

//placeholder for now
async function price_check(page) {


    const lower_price = await page.locator('.amount.notranslate.ng-star-inserted').first().textContent()
    const lower_price_number = parseInt(lower_price)

    if (lower_price_number <= fly_requirements.max_price) {
        console.log(`Cena biletu to: ${lower_price_number} a maksymalna cena to ${fly_requirements.max_price}\n 
        rezerwa wynosi: ${fly_requirements.max_price - lower_price_number}`)
    }}



test('Esky Select cheapest fly', async ({page, context}) => {

    // go to page
    await page.goto(test_config.url)

    // accept cookies
    await page.locator(test_config.accept_cookies).click()

    //fill departure and destination
    await page.locator(selectors.departure_place_selector).fill(test_data.departure_place)
    await page.locator(selectors.destination_selector).fill(test_data.destination_place)

    // select provided date  (name number = day of month) << WIP This can be refactored and improved in future
    await page.locator(selectors.departure_date).click()
    await page.getByRole('link', { name: '24' }).click()




    const departure_date_input = await page.locator(selectors.departure_date).inputValue() //take string which is date by format: year-month-day
    expect(departure_date_input).toEqual(test_data.departure_date) // Verify if matched with variable

    // select provided date  (name number = day of month) << WIP This can be refactored and improved in future
    await page.locator(selectors.return_date).click()
    await page.getByRole('link', { name: '31' }).click()
    
    const return_date_input = await page.locator(selectors.return_date).inputValue() //grab string with date
    expect(return_date_input).toEqual(test_data.return_date) // compare to variable string

    // open passenger dropdown list
    await page.locator(selectors.passengers_dropdown).click()

    //add one adult passenger
    await page.locator('.plus').first().click() // WIP refactor and improvements possible

    //taking string with number of passengers
    const passenger_number_input = await page.locator(selectors.passengers_dropdown).textContent() 

    //checking if match with provided data in test_data
    expect(passenger_number_input).toEqual(test_data.passenger_number) 

    //click again to hide that window
    await page.locator(selectors.passengers_dropdown).click()

    // click search 
    await page.locator(selectors.search_button).click()

    // open  quick-filter menu
    await page.getByTestId('sorters-dropdown-trigger').getByPlaceholder('Please choose an option').click()

    // select cheapest
    await page.getByTestId('price-radio').locator('label span').nth(1).click()


    
    // run function
    await direct_fly_check_activate(page)

    // run function
    await check_emission(page)



    await page.pause()
})


