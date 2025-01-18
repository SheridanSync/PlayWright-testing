import { test } from '@playwright/test'

const test_configuration = {
    url: 'https://store.epicgames.com/en-US/',
    accept_cookies: '#onetrust-accept-btn-handler'
}

async function getFreeGamesTitles(page) {
    //assign all text (game titles) to variable
    const gameTitles = await page.locator('h6.eds_1ypbntd0.eds_1ypbntd7.eds_1ypbntdq').allTextContents();
  
   // first title is available right now and second is available from thursday next week
    const currentWeekGameTitle = gameTitles[0];
    const nextWeekGameTitle = gameTitles[1];
  
    
    console.log(`Tytuł gry dostępnej w tym tygodniu: ${currentWeekGameTitle} \na tytul gry w przyszlym tygodniu to: ${nextWeekGameTitle}`);
    
  }


test('Check Free Games on Epic', async({page}) => {


// go to website
await page.goto(test_configuration.url)

// accept cookies
await page.locator(test_configuration.accept_cookies).click()

//call function that write game titles
await getFreeGamesTitles(page)

// pause for debugging
await page.pause()
} )
