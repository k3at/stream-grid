import { expect, test } from "@playwright/test";

test.describe("شبكة البث", () => {
  test("RTL + عنوان", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page).toHaveTitle(/شبكة البث/);
  });

  test("عرض قنوات", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("article").first()).toBeVisible();
    const count = await page.locator("article").count();
    expect(count).toBeGreaterThan(0);
  });

  test("بحث", async ({ page }) => {
    await page.goto("/");
    const search = page.getByPlaceholder("بحث عن مباراة...");
    await search.fill("zzznomatch");
    await expect(page.getByText("لا توجد قنوات لعرضها")).toBeVisible();
    await search.fill("");
  });

  test("تشغيل مشغل", async ({ page }) => {
    await page.goto("/");
    const play = page.getByRole("button", { name: "▶ تشغيل" }).first();
    await play.click();
    await expect(page.locator("iframe").first()).toBeVisible();
  });

  test("تكبير/تصغير", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /تكبير/ }).first();
    await toggle.click();
    await expect(page.locator("article").first()).toHaveClass(/col-span-full/);
    const shrink = page.getByRole("button", { name: /تصغير/ }).first();
    await shrink.click();
    await expect(page.locator("article").first()).not.toHaveClass(/col-span-full/);
  });

  test("لوحة الإدارة محمية", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByPlaceholder("كلمة المرور")).toBeVisible();
  });

  test("health API", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
  });
});