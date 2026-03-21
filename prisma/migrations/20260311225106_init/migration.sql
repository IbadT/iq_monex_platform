-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "slot_cource" AS ENUM ('SUBSCRIPTION', 'SLOT_PACKAGE');

-- CreateEnum
CREATE TYPE "payment_item_type" AS ENUM ('SUBSCRIPTION', 'SLOT_PACKAGE', 'DONATION');

-- CreateEnum
CREATE TYPE "tariff_code" AS ENUM ('BASE', 'MAIN', 'PREMIUM');

-- CreateEnum
CREATE TYPE "listing_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "listing_condition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "map_location_type" AS ENUM ('OFFICE', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "file_owner_type" AS ENUM ('USER', 'LISTING');

-- CreateEnum
CREATE TYPE "file_kind" AS ENUM ('AVATAR', 'PHOTO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "review_target_type" AS ENUM ('LISTING', 'USER');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_rates" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "nominal" INTEGER NOT NULL,
    "rate" DECIMAL(10,4) NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_measurements" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "unit_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specifications" (
    "id" SERIAL NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_specifications" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "specification_id" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "default_unit_id" INTEGER,

    CONSTRAINT "category_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pinned_chats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "pinned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pinned_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_chats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "chats_id" UUID NOT NULL,

    CONSTRAINT "users_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "chat_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_files" (
    "id" UUID NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "upload_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "user_id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "expires_at" DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '30 days',
    "file_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "title" VARCHAR(255),
    "description" VARCHAR(3000),
    "status" "listing_status" NOT NULL DEFAULT 'DRAFT',
    "price" DECIMAL(15,2),
    "currency_id" INTEGER,
    "price_unit_id" INTEGER,
    "condition" "listing_condition",
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "auto_delete_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_specifications" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "specification_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "unit_id" INTEGER,
    "is_required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "listing_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_locations" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "type" "map_location_type" NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "geo_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "map_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "owner_type" "file_owner_type" NOT NULL,
    "s3_key" TEXT NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "kind" "file_kind" NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "upload_status" TEXT NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID,
    "listing_id" UUID,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "target_type" "review_target_type" NOT NULL,
    "listing_id" UUID,
    "target_user_id" UUID,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "content" VARCHAR(2000) NOT NULL,
    "status" "review_status" NOT NULL DEFAULT 'PENDING',
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "reports_count" INTEGER NOT NULL DEFAULT 0,
    "reply_content" VARCHAR(1000),
    "reply_at" TIMESTAMP(3),
    "reply_author_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_files" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "s3_key" TEXT NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_likes" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_likes" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffs" (
    "id" UUID NOT NULL,
    "code" "tariff_code" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "base_slots" INTEGER NOT NULL,
    "base_days" INTEGER NOT NULL,
    "max_total_days" INTEGER NOT NULL,
    "is_extendable" BOOLEAN NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tariff_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_slots" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_periods" (
    "id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "days" INTEGER NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "payment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "external_id" VARCHAR(100) NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "invoice_id" VARCHAR(50),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_items" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "item_type" "payment_item_type" NOT NULL,
    "itemId" UUID NOT NULL,
    "item_id_str" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "comment" TEXT,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "payment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_packages" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "slots" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "payment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_slots" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "slot_index" INTEGER NOT NULL,
    "source_type" "slot_cource" NOT NULL,
    "source_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "slotPackageId" UUID,

    CONSTRAINT "user_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_slots" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "user_slot_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL,
    "released_at" TIMESTAMP(3),
    "release_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currency_rates_code_key" ON "currency_rates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "category_specifications_category_id_specification_id_key" ON "category_specifications"("category_id", "specification_id");

-- CreateIndex
CREATE INDEX "users_chats_index_0" ON "users_chats"("user_id", "chats_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_chats_user_id_chats_id_key" ON "users_chats"("user_id", "chats_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_user_id_chat_id_key" ON "chat_participants"("user_id", "chat_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "listings_user_id_status_idx" ON "listings"("user_id", "status");

-- CreateIndex
CREATE INDEX "listings_status_auto_delete_at_idx" ON "listings"("status", "auto_delete_at");

-- CreateIndex
CREATE INDEX "listings_subcategory_id_status_published_at_idx" ON "listings"("subcategory_id", "status", "published_at");

-- CreateIndex
CREATE INDEX "listings_status_last_used_at_idx" ON "listings"("status", "last_used_at");

-- CreateIndex
CREATE UNIQUE INDEX "listing_specifications_listing_id_specification_id_key" ON "listing_specifications"("listing_id", "specification_id");

-- CreateIndex
CREATE INDEX "map_locations_listing_id_idx" ON "map_locations"("listing_id");

-- CreateIndex
CREATE INDEX "map_locations_latitude_longitude_idx" ON "map_locations"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "map_locations_geo_hash_idx" ON "map_locations"("geo_hash");

-- CreateIndex
CREATE INDEX "files_user_id_idx" ON "files"("user_id");

-- CreateIndex
CREATE INDEX "files_listing_id_idx" ON "files"("listing_id");

-- CreateIndex
CREATE INDEX "files_owner_type_user_id_idx" ON "files"("owner_type", "user_id");

-- CreateIndex
CREATE INDEX "files_owner_type_listing_id_idx" ON "files"("owner_type", "listing_id");

-- CreateIndex
CREATE INDEX "files_owner_type_user_id_kind_idx" ON "files"("owner_type", "user_id", "kind");

-- CreateIndex
CREATE INDEX "files_owner_type_listing_id_kind_idx" ON "files"("owner_type", "listing_id", "kind");

-- CreateIndex
CREATE INDEX "files_upload_status_expires_at_idx" ON "files"("upload_status", "expires_at");

-- CreateIndex
CREATE INDEX "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "favorites_listing_id_idx" ON "favorites"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_listing_id_key" ON "favorites"("user_id", "listing_id");

-- CreateIndex
CREATE INDEX "reviews_author_id_idx" ON "reviews"("author_id");

-- CreateIndex
CREATE INDEX "reviews_listing_id_status_idx" ON "reviews"("listing_id", "status");

-- CreateIndex
CREATE INDEX "reviews_target_user_id_status_idx" ON "reviews"("target_user_id", "status");

-- CreateIndex
CREATE INDEX "review_files_review_id_idx" ON "review_files"("review_id");

-- CreateIndex
CREATE INDEX "listing_likes_listing_id_idx" ON "listing_likes"("listing_id");

-- CreateIndex
CREATE INDEX "listing_likes_user_id_idx" ON "listing_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_likes_listing_id_user_id_key" ON "listing_likes"("listing_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_likes_review_id_user_id_key" ON "review_likes"("review_id", "user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_is_active_idx" ON "subscriptions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "subscription_periods_subscription_id_end_at_idx" ON "subscription_periods"("subscription_id", "end_at");

-- CreateIndex
CREATE INDEX "payments_user_id_status_idx" ON "payments"("user_id", "status");

-- CreateIndex
CREATE INDEX "payments_external_id_idx" ON "payments"("external_id");

-- CreateIndex
CREATE INDEX "payments_status_created_at_idx" ON "payments"("status", "created_at");

-- CreateIndex
CREATE INDEX "payment_items_payment_id_idx" ON "payment_items"("payment_id");

-- CreateIndex
CREATE INDEX "payment_items_item_type_itemId_idx" ON "payment_items"("item_type", "itemId");

-- CreateIndex
CREATE INDEX "donations_user_id_idx" ON "donations"("user_id");

-- CreateIndex
CREATE INDEX "slot_packages_user_id_is_active_idx" ON "slot_packages"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "user_slots_user_id_expires_at_idx" ON "user_slots"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "user_slots_source_type_source_id_idx" ON "user_slots"("source_type", "source_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_slots_user_id_slot_index_key" ON "user_slots"("user_id", "slot_index");

-- CreateIndex
CREATE UNIQUE INDEX "listing_slots_listing_id_key" ON "listing_slots"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "listing_slots_user_slot_id_key" ON "listing_slots"("user_slot_id");

-- CreateIndex
CREATE INDEX "listing_slots_user_slot_id_released_at_idx" ON "listing_slots"("user_slot_id", "released_at");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_specifications" ADD CONSTRAINT "category_specifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_specifications" ADD CONSTRAINT "category_specifications_specification_id_fkey" FOREIGN KEY ("specification_id") REFERENCES "specifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinned_chats" ADD CONSTRAINT "pinned_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pinned_chats" ADD CONSTRAINT "pinned_chats_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_chats" ADD CONSTRAINT "users_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_chats" ADD CONSTRAINT "users_chats_chats_id_fkey" FOREIGN KEY ("chats_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_files" ADD CONSTRAINT "chat_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_files" ADD CONSTRAINT "chat_files_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_price_unit_id_fkey" FOREIGN KEY ("price_unit_id") REFERENCES "unit_measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_specifications" ADD CONSTRAINT "listing_specifications_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_locations" ADD CONSTRAINT "map_locations_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "file_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "file_listing_fk" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_files" ADD CONSTRAINT "review_files_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_likes" ADD CONSTRAINT "listing_likes_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_likes" ADD CONSTRAINT "listing_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_periods" ADD CONSTRAINT "subscription_periods_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_items" ADD CONSTRAINT "payment_items_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_packages" ADD CONSTRAINT "slot_packages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_slots" ADD CONSTRAINT "user_slots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_slots" ADD CONSTRAINT "userslot_subscription_fk" FOREIGN KEY ("source_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_slots" ADD CONSTRAINT "user_slots_slotPackageId_fkey" FOREIGN KEY ("slotPackageId") REFERENCES "slot_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_slots" ADD CONSTRAINT "listing_slots_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_slots" ADD CONSTRAINT "listing_slots_user_slot_id_fkey" FOREIGN KEY ("user_slot_id") REFERENCES "user_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
