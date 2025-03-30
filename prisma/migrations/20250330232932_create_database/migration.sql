-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "limit" DECIMAL NOT NULL,
    "expired" INTEGER NOT NULL,
    "avatar" TEXT,
    "balance" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "due_date" INTEGER NOT NULL,
    "closing_date" INTEGER NOT NULL,
    "color_font" TEXT NOT NULL,
    "color_card" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shopping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type_invoice" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "cardId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    CONSTRAINT "shopping_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "shopping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "shopping_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "installment_number" INTEGER NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "shoppingId" TEXT NOT NULL,
    CONSTRAINT "installments_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shopping" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pay" BOOLEAN NOT NULL,
    "total_invoice" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "target_value" DECIMAL NOT NULL,
    "value" DECIMAL NOT NULL,
    "institution" TEXT NOT NULL,
    "color_font" TEXT NOT NULL,
    "color_application" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "extracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    CONSTRAINT "extracts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
