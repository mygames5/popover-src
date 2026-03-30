import puppeteer from "puppeteer";

describe("тесты виджетов", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test("поповер должен показаться по клику", async () => {
    await page.goto("http://localhost:8080");
    // ждем кнопку с правильным ID
    await page.waitForSelector("#popover-btn");
    await page.click("#popover-btn");

    // проверяем что плашка появилась (используем правильный класс)
    const popover = await page.$(".popover-box");
    expect(popover).not.toBeNull();
  });

  test("валидация црм должна показать ошибку", async () => {
    await page.goto("http://localhost:8080");
    await page.waitForSelector("#add-btn");
    await page.click("#add-btn");

    // ждем модалку и жмем сохранить ничего не вводя
    await page.waitForSelector("#save-btn");
    await page.click("#save-btn");

    // проверяем что ошибка вылезла (стала не hidden)
    const isErrorVisible = await page.$eval(
      "#error-name", // Исправленный ID
      (el) => !el.classList.contains("hidden"),
    );
    expect(isErrorVisible).toBe(true);
  });
});
