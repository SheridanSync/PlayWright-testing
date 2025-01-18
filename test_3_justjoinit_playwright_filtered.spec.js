import {test, expect} from '@playwright/test'


// init configuration data
const test_configuration = {
    url: 'https://justjoin.it/',
    url_after_playwright_text: 'https://justjoin.it/job-offers/all-locations?keyword=PlayWright',
    url_after_remote_set: 'https://justjoin.it/job-offers/all-locations?remote=yes&keyword=PlayWright',
    url_with_salary_only: 'https://justjoin.it/job-offers/all-locations?remote=yes&with-salary=yes&keyword=PlayWright',
    number_of_filters_checked: '+5',
    url_with_all_filters: 'https://justjoin.it/job-offers/all-locations?experience-level=junior,mid&remote=yes&with-salary=yes&working-hours=freelance,part-time,practice-internship&keyword=PlayWright&orderBy=DESC&sortBy=published'
}

// input data
const test_data = {
    Search_Text: 'PlayWright',
   

}
// selectors 
const selectors = {
    accept_cookies: '#cookiescript_accept',
    Search_Bar: 'Search',
    Offer_number: 'h1.MuiTypography-root.MuiTypography-subtitle2.css-15r5qmk',
    Remote_offers_checkbox: '.MuiSwitch-root.MuiSwitch-sizeSmall.css-1lwfe8r',
    ads_with_salary_only: '.MuiBox-root css-1ofqsdc',


}
// variables used in loops
const Seniority = ['Junior', 'Mid', 'Freelance']; 
const WorkingHours = ['Part-time', 'Practice / Internship']; 


// function that return number of job ads 
async function Offer_Number(page) {
    await page.waitForURL(test_configuration.url_after_playwright_text)

    const offer_text = await page.locator(selectors.Offer_number).textContent();

    return console.log(`poczatkowa ilosc ofert: ${offer_text}`)
}

//test name + init
test ('JustJoinIT PlayWright ads filtered test', async ({page}) => {

    // enter website
    await page.goto(test_configuration.url)

    //accept cookies button
    await page.locator(selectors.accept_cookies).click()

    //click on searchbar fill with data and press enter
    await page.getByPlaceholder(selectors.Search_Bar).click();
    await page.getByPlaceholder(selectors.Search_Bar).fill(test_data.Search_Text);
    await page.getByPlaceholder(selectors.Search_Bar).press('Enter');


    // call function and return number of job offers
    await Offer_Number(page)

    //check remote-only job ads 
    await page.locator(selectors.Remote_offers_checkbox).click()


    // first assertion checking if remote jobs only checked
    await expect(page).toHaveURL(test_configuration.url_after_remote_set)


    // click button to show only ads with salary defined
    await page.getByRole('tab', { name: 'With salary' }).click();


    // second assertion checking if salary button were clicked (updated url)
    await expect(page).toHaveURL(test_configuration.url_with_salary_only)


    // click button that open new window with filters
    await page.getByRole('button', { name: 'More filters' }).click();

    // two loops that click filters provided in variables
    for (const level of Seniority) {
        await page.getByLabel(level).check()
    }

    for (const hours of WorkingHours) {
        await page.getByLabel(hours).check()
    }

    // submission of all filters that checked after loops ended.
    await page.getByRole('button', { name: 'Show offers' }).click();

    // two variables that extracting text for next upcoming assertions
    const buttonText = await page.locator('button[name="more_filters_button"]').textContent();

    const no_offer_text = await page.getByText('We did not find any offers').textContent()

    // if no_offer_text text appeared test will react with proper text below
    if (no_offer_text) {
        console.log('Oczekiwany rezultat: Brak ogloszen.')
    }
    // both conditionals are fine to process.
    else {
        console.log('Podane filtry zwracaja ogloszenia o prace. Rowniez oczekiwany rezultat.')
    }

    // conditional that check if all filter were properly selected and applied
    if(buttonText.includes(test_configuration.number_of_filters_checked)) {
        console.log('Test zakonczony pomyslnie')
    }
    else {
        console.log('Cos zle po stronie filtrow.')
    }

    // final assertion that check url with all requirements.
    await expect(page).toHaveURL(test_configuration.url_with_all_filters)
    
    await page.pause()
})
