const { test, expect } = require('@playwright/test');
const config = require('../playwright.config');

const BASE_URL = config.projects.find(project => project.name === 'API Tests').use.baseURL;
const PET_ENDPOINT = `${BASE_URL}/pet`;

function stringifyBody(body) {
  return JSON.stringify(body, null, 2);
}

function logResponse(title, response) {
  console.log(`${title} - Status Code: ${response.status()}`);
}

test.describe('Petstore API Tests', () => {
  let petId;

  test('Create a new pet', async ({ request }) => {
    petId = Math.floor(Math.random() * 10000000000).toString();
    const createResponse = await request.post(PET_ENDPOINT, {
      data: {
        id: petId,
        name: "Doggy",
        status: "available",
        tags: [
          { id: 1, name: "domestic" },
          { id: 2, name: "furry" }
        ],
        photoUrls: ["https://upload.wikimedia.org/wikipedia/commons/c/ca/Dog.jpg"]
      }
    });
    
    logResponse('Create Pet', createResponse);
    
    const createdPet = await createResponse.json();
    await expect(createResponse.ok()).toBeTruthy();
    await expect(createdPet.id.toString()).toBe(petId);
    await expect(createdPet.name).toBe("Doggy");
    await expect(createdPet.status).toBe("available");
    await expect(createdPet.tags).toHaveLength(2);
    await expect(createdPet.tags[0].name).toBe("domestic");
    await expect(createdPet.tags[1].name).toBe("furry");
    await expect(createdPet.photoUrls).toHaveLength(1);
    await expect(createdPet.photoUrls[0]).toBe("https://upload.wikimedia.org/wikipedia/commons/c/ca/Dog.jpg");
  });

  test('Retrieve the created pet', async ({ request }) => {
    const getResponse = await request.get(`${PET_ENDPOINT}/${petId}`);
    
    logResponse('Get Pet', getResponse);
    
    const retrievedPet = await getResponse.json();
    await expect(getResponse.ok()).toBeTruthy();
    await expect(retrievedPet.id.toString()).toBe(petId);
    await expect(retrievedPet.name).toBe("Doggy");
    await expect(retrievedPet.status).toBe("available");
    await expect(retrievedPet.tags).toHaveLength(2);
    await expect(retrievedPet.tags[0].name).toBe("domestic");
    await expect(retrievedPet.tags[1].name).toBe("furry");
    await expect(retrievedPet.photoUrls).toHaveLength(1);
    await expect(retrievedPet.photoUrls[0]).toBe("https://upload.wikimedia.org/wikipedia/commons/c/ca/Dog.jpg");
  });

  test('Update the pet', async ({ request }) => {
    const newName = "Kitty";
    const updateResponse = await request.put(PET_ENDPOINT, {
      data: {
        id: petId,
        name: newName,
        status: "sold",
        tags: [
          { id: 1, name: "domestic" },
          { id: 2, name: "furry" },
          { id: 3, name: "playful" }
        ],
        photoUrls: ["https://upload.wikimedia.org/wikipedia/commons/c/ca/Dog.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg"]
      }
    });
    
    logResponse('Update Pet', updateResponse);
    
    const updatedPet = await updateResponse.json();
    await expect(updateResponse.ok()).toBeTruthy();
    await expect(updatedPet.id.toString()).toBe(petId);
    await expect(updatedPet.name).toBe("Kitty");
    await expect(updatedPet.status).toBe("sold");
    await expect(updatedPet.tags).toHaveLength(3);
    await expect(updatedPet.tags[2].name).toBe("playful");
    await expect(updatedPet.photoUrls).toHaveLength(2);
    await expect(updatedPet.photoUrls[1]).toBe("https://upload.wikimedia.org/wikipedia/commons/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg");
  });

  test('Find pets by status', async ({ request }) => {
    const status = 'available';
    const findResponse = await request.get(`${PET_ENDPOINT}/findByStatus?status=${status}`);

    logResponse('Find Pets by Status', findResponse);

    const foundPets = await findResponse.json();
    await expect(findResponse.ok()).toBeTruthy();
    await expect(Array.isArray(foundPets)).toBeTruthy();
    await expect(foundPets.length).toBeGreaterThan(0);
    await expect(foundPets.every(pet => pet.status === status)).toBeTruthy();
  });

  test('Delete the pet', async ({ request }) => {
    const deleteResponse = await request.delete(`${PET_ENDPOINT}/${petId}`);
    
    logResponse('Delete Pet', deleteResponse);
    
    await expect(deleteResponse.ok()).toBeTruthy();

    const checkDeleteResponse = await request.get(`${PET_ENDPOINT}/${petId}`);
    
    logResponse('Check Deleted Pet', checkDeleteResponse);
    
    await expect(checkDeleteResponse.status()).toBe(404);
  });
});