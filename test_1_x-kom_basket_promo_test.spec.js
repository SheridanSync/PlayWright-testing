import { test, expect } from '@playwright/test'


const test_configuration = {
url: 'https://www.x-kom.pl/',
search_data: 'laptop rtx 4060'
}

const selectors = {
cookies_accept: '[aria-label="W porządku"]',
search_form: '.parts__InnerWrapper-sc-dc467493-2 input',
add_to_basket_first_product: '[aria-label="Dodaj do koszyka"]',

add_to_basket_second_product: 'div:nth-child(2) > .parts__Wrapper-sc-ab69dfd9-0 > .parts__SwipeableContainer-sc-ab69dfd9-1 > .parts__ProductCardWrapper-sc-d5832e95-2 > div:nth-child(3) > .parts__CardButtons-sc-d5832e95-18 > .parts__Wrapper-sc-cba5a15e-0 > .parts__Wrapper-sc-77fd6d7e-0 > .sc-iVCKna',

add_to_basket_third_product: 'div:nth-child(3) > .parts__Wrapper-sc-ab69dfd9-0 > .parts__SwipeableContainer-sc-ab69dfd9-1 > .parts__ProductCardWrapper-sc-d5832e95-2 > div:nth-child(3) > .parts__CardButtons-sc-d5832e95-18 > .parts__Wrapper-sc-cba5a15e-0 > .parts__Wrapper-sc-77fd6d7e-0 > .sc-iVCKna',

total_price: '.parts__PriceWrapper-sc-4d9f3004-5 opQSJ',

}

// function that check number of products in basket and verify based on provided argument 
async function verifyBasketCount(page, expectedCount) {
    const basketCounter = await page.locator('.parts__Counter-sc-b199d13a-2').textContent();
    if (basketCounter.includes(`${expectedCount} produkty`)) {
      console.log(`Koszyk zawiera ${expectedCount} produkty.`);
      return true;
    } else {
      console.log(`Koszyk nie zawiera ${expectedCount} produktów.`);
      return false;
    }
  }

  // function that verify basket product number each time new product is added to the basket
 async function expected_product_number(page,product_count) {
  const number_string = await page.locator('.sc-gWHAAX.dzyPgd').textContent()
  const number_int = parseInt(number_string)
  if (number_int >= product_count) {
    console.log(`liczba dodanych produktow: ${product_count} poprawnie dodana`)
  }
  else {
    console.log(`Liczba produktow w koszyku: ${product_count} nie zostala poprawnie dodana do koszyka.`)
  }
 }

 

test('x-kom rtx laptop basket test', async ({page}) => {

    // go to page
  await page.goto(test_configuration.url)

  // accept cookies
  await page.locator(selectors.cookies_accept).click()

  // click on searchbar and fill data 
  await page.locator(selectors.search_form).click()
  await page.locator(selectors.search_form).fill(test_configuration.search_data)

  //click search
  await page.getByRole('button', {name: "Przycisk „szukaj"}).click()

  // add first produkt to basket and close popup window
  await page.locator(selectors.add_to_basket_first_product).nth(0).click();
  await page.getByLabel('Wróć do zakupów').click()
  await expected_product_number(page,1)


  // add second produkt to basket and close popup window
  await page.locator(selectors.add_to_basket_second_product).click()
  await page.getByLabel('Wróć do zakupów').click()
  await expected_product_number(page,2)

  // add third produkt to basket and close popup window
  await page.locator(selectors.add_to_basket_third_product).click()
  await page.getByLabel('Wróć do zakupów').click();
  await expected_product_number(page,3)

  // go to checkout
  await page.getByLabel('koszyk', { exact: true }).click();

 
  // function that checks if there are 4 products in basket (one is added as promo unable to delete:) as of 17/01/2025 date )
  await verifyBasketCount(page,4) 

  // conditional statement if there's promo added to basket automatically
  if (await page.getByTitle('Nie możesz usunąć tego').isVisible()) {
    console.log('Promocja dodana do koszyka i nie mozna usunac :( ')

  }
  else {
    console.log('Nie ma promocji. Test powinien miec ustawiona argument w VerifyBasketCount na 3')

  }

  
  
  // pause for debugging if needed
  await page.pause()
})
