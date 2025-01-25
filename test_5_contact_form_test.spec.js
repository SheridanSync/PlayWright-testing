import {test, expect} from '@playwright/test'

// data for login
const user_login_data = { 
    email: 'falkon@testing.com',
    password: '1234567'
}

// data while creating contact_1
const contact1_data = {
    firstName: 'Ronny',
    lastName: 'Grander',
    birthDate: '2006-10-03',
    contactEmail: 'falcon1@testing.com',
    phone: '9006003000',
    address: 'Piątkowska 5',
    city: 'Poznań',
    state: 'Wielkopolskie',
    postalCode: '90-300',
    country: 'Poland'
}

// form selectors + data to process with loop
const formFields = [
    { placeholder: 'First Name', value: contact1_data.firstName },
    { placeholder: 'Last Name', value: contact1_data.lastName },
    { placeholder: 'yyyy-MM-dd', value: contact1_data.birthDate },
    { placeholder: 'example@email.com', value: contact1_data.contactEmail },
    { placeholder: '8005551234', value: contact1_data.phone },
    { placeholder: 'Address 1', value: contact1_data.address },
    { placeholder: 'City', value: contact1_data.city },
    { placeholder: 'State or Province', value: contact1_data.state },
    { placeholder: 'Postal Code', value: contact1_data.postalCode },
    { placeholder: 'Country', value: contact1_data.country }
];

//updating data 
const contact_1_update_data = {
    name: 'Ronny Grander',
    email: 'falcon2@testing.com'
}
// error messages data
const error_messages = {
    error_id: '#error',
    no_name_error: 'Validation failed: lastName: Path `lastName` is required., firstName: Path `firstName` is required.'
}

// run all tests
test.describe('Contact List Tests', () => {
    //before each test go to concerned page + log in with provided data
    test.beforeEach(async ({ page }) => {
        
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        await page.getByPlaceholder('Email').click();
        await page.getByPlaceholder('Email').fill(user_login_data.email);
        
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill(user_login_data.password);
        
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    test('add contact', async ({ page }) => {
        // click create contaxct button
        await page.getByRole('button', { name: 'Add a New Contact' }).click();

        

        // loop that fulfill entire form
        for (const field of formFields) {
            await page.getByPlaceholder(field.placeholder).click();
            await page.getByPlaceholder(field.placeholder).fill(field.value);
        }

        // submission of form
        await page.getByRole('button', { name: 'Submit' }).click();
        // assertion that verify if cell with name is visible
        await expect(page.getByRole('cell', { name: 'Ronny Grander' })).not.toHaveAttribute('hidden');
    });

    test('test_1 Edit Contact ', async ({ page }) => {
        // edit data
        await page.getByRole('cell', { name: '9006003000' }).click();
        await page.getByRole('button', { name: 'Edit Contact' }).click();
        await page.getByLabel('First Name:').click();
        await page.getByLabel('First Name:').fill('');
        await page.getByLabel('Email:').click();
        await page.getByLabel('Email:').press('ArrowRight');
        await page.getByLabel('Email:').click();
        await page.getByLabel('Email:').fill('');
        // submission 
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'Return to Contact List' }).click();
       // asserion that updated name should be visible 
        await expect(page.getByRole('cell', { name: 'Ronny Grander' }),'Name assertion not passed').toBeVisible();

      
    });

    test('test_2 delete name ', async ({ page }) => {

        await page.getByRole('cell', { name: 'Name' }).click();
        await page.getByRole('cell', { name: '9006003000' }).click();
        await page.getByRole('button', { name: 'Edit Contact' }).click();
        await page.getByLabel('First Name:').click();
        await page.getByLabel('First Name:').fill(''); // leaving first name as empty
        await page.getByRole('button', { name: 'Submit' }).click(); // submission
        // assertion that verify if error messages appeared
        await expect(page.locator(error_messages.error_id),'Error message did not appear').toHaveText(error_messages.no_name_error)



        

    });
    test('test_3 delete contact ', async ({ page }) => {
        // click anywhere to open dialogue with deletion option
        await page.getByRole('cell', { name: '9006003000' }).click();
        
        // listening and processing with dialogue
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept(); // accept if appeared 
        });
    
        // click delete button
        await page.getByRole('button', { name: 'Delete Contact' }).click();
        // assertion that verify if contact were deleted (not visible)
        await expect(page.getByRole('cell', { name: 'Ronny Grander' }),'account deletion assertion failed').not.toBeVisible();

    });

});