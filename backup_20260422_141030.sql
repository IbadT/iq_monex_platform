--
-- PostgreSQL database dump
--

\restrict SxnpvEk13DSLlqE0qgxSi3FuZ6JIbBdWF96hUzEFNerc3ykOyJD2LOGMhIEmthx

-- Dumped from database version 14.22 (Debian 14.22-1.pgdg13+1)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: iqmonex_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO iqmonex_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: iqmonex_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ComplaintType; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public."ComplaintType" AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public."ComplaintType" OWNER TO iqmonex_user;

--
-- Name: DonationStatus; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public."DonationStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public."DonationStatus" OWNER TO iqmonex_user;

--
-- Name: FavoriteType; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public."FavoriteType" AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public."FavoriteType" OWNER TO iqmonex_user;

--
-- Name: UserNoteTargetType; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public."UserNoteTargetType" AS ENUM (
    'USER',
    'LISTING'
);


ALTER TYPE public."UserNoteTargetType" OWNER TO iqmonex_user;

--
-- Name: file_kind; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.file_kind AS ENUM (
    'AVATAR',
    'PHOTO',
    'DOCUMENT',
    'COMPLAINT_PHOTO'
);


ALTER TYPE public.file_kind OWNER TO iqmonex_user;

--
-- Name: file_owner_type; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.file_owner_type AS ENUM (
    'USER',
    'WORKER',
    'LISTING',
    'COMPLAINT',
    'SUGGESTION'
);


ALTER TYPE public.file_owner_type OWNER TO iqmonex_user;

--
-- Name: listing_condition; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.listing_condition AS ENUM (
    'NEW',
    'USED'
);


ALTER TYPE public.listing_condition OWNER TO iqmonex_user;

--
-- Name: listing_status; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.listing_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED',
    'TEMPLATE'
);


ALTER TYPE public.listing_status OWNER TO iqmonex_user;

--
-- Name: map_location_type; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.map_location_type AS ENUM (
    'MAIN_OFFICE',
    'OFFICE',
    'WAREHOUSE',
    'DEAL'
);


ALTER TYPE public.map_location_type OWNER TO iqmonex_user;

--
-- Name: payment_item_type; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.payment_item_type AS ENUM (
    'SUBSCRIPTION',
    'SLOT_PACKAGE',
    'DONATION'
);


ALTER TYPE public.payment_item_type OWNER TO iqmonex_user;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payment_status OWNER TO iqmonex_user;

--
-- Name: promo_campaign_status; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.promo_campaign_status AS ENUM (
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public.promo_campaign_status OWNER TO iqmonex_user;

--
-- Name: promo_participant_status; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.promo_participant_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'ELIGIBLE',
    'FAILED',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public.promo_participant_status OWNER TO iqmonex_user;

--
-- Name: review_status; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.review_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.review_status OWNER TO iqmonex_user;

--
-- Name: review_target_type; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.review_target_type AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public.review_target_type OWNER TO iqmonex_user;

--
-- Name: role_types; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.role_types AS ENUM (
    'WORKER',
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public.role_types OWNER TO iqmonex_user;

--
-- Name: slot_cource; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.slot_cource AS ENUM (
    'SUBSCRIPTION',
    'SLOT_PACKAGE'
);


ALTER TYPE public.slot_cource OWNER TO iqmonex_user;

--
-- Name: tariff_code; Type: TYPE; Schema: public; Owner: iqmonex_user
--

CREATE TYPE public.tariff_code AS ENUM (
    'BASE',
    'MAIN',
    'PREMIUM',
    'ADDITIONAL_PACKAGE'
);


ALTER TYPE public.tariff_code OWNER TO iqmonex_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.activities OWNER TO iqmonex_user;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO iqmonex_user;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    "parentId" integer
);


ALTER TABLE public.categories OWNER TO iqmonex_user;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO iqmonex_user;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_specifications; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.category_specifications (
    id integer NOT NULL,
    category_id integer NOT NULL,
    specification_id integer NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    default_unit_id integer
);


ALTER TABLE public.category_specifications OWNER TO iqmonex_user;

--
-- Name: category_specifications_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.category_specifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_specifications_id_seq OWNER TO iqmonex_user;

--
-- Name: category_specifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.category_specifications_id_seq OWNED BY public.category_specifications.id;


--
-- Name: chat_files; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.chat_files (
    id uuid NOT NULL,
    mime_type character varying(100) NOT NULL,
    upload_status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    expires_at date DEFAULT (CURRENT_DATE + '30 days'::interval) NOT NULL,
    file_url character varying(255) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chat_files OWNER TO iqmonex_user;

--
-- Name: chat_participants; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.chat_participants (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.chat_participants OWNER TO iqmonex_user;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.chats (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chats OWNER TO iqmonex_user;

--
-- Name: complaints; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.complaints (
    id uuid NOT NULL,
    "complaintType" public."ComplaintType" NOT NULL,
    type text NOT NULL,
    text text NOT NULL,
    author_id uuid NOT NULL,
    listing_id uuid,
    target_user_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.complaints OWNER TO iqmonex_user;

--
-- Name: currencies; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.currencies (
    id integer NOT NULL,
    symbol text NOT NULL,
    code text NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.currencies OWNER TO iqmonex_user;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.currencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currencies_id_seq OWNER TO iqmonex_user;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


--
-- Name: currency_rates; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.currency_rates (
    id integer NOT NULL,
    code character varying(3) NOT NULL,
    nominal integer NOT NULL,
    rate numeric(10,4) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.currency_rates OWNER TO iqmonex_user;

--
-- Name: currency_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.currency_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currency_rates_id_seq OWNER TO iqmonex_user;

--
-- Name: currency_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.currency_rates_id_seq OWNED BY public.currency_rates.id;


--
-- Name: donations; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.donations (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text NOT NULL,
    comment text,
    status public."DonationStatus" DEFAULT 'PENDING'::public."DonationStatus" NOT NULL,
    payment_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.donations OWNER TO iqmonex_user;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.favorites (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    type public."FavoriteType" NOT NULL,
    listing_id uuid,
    target_user_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO iqmonex_user;

--
-- Name: files; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    owner_type public.file_owner_type NOT NULL,
    s3_key text NOT NULL,
    s3_bucket text NOT NULL,
    url text NOT NULL,
    file_type text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    kind public.file_kind NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    upload_status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id uuid,
    listing_id uuid,
    complaint_id uuid,
    worker_id uuid,
    suggestion_id integer
);


ALTER TABLE public.files OWNER TO iqmonex_user;

--
-- Name: legal_entity_types; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.legal_entity_types (
    id integer NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.legal_entity_types OWNER TO iqmonex_user;

--
-- Name: legal_entity_types_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.legal_entity_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.legal_entity_types_id_seq OWNER TO iqmonex_user;

--
-- Name: legal_entity_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.legal_entity_types_id_seq OWNED BY public.legal_entity_types.id;


--
-- Name: listing_likes; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.listing_likes (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.listing_likes OWNER TO iqmonex_user;

--
-- Name: listing_slots; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.listing_slots (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    user_slot_id uuid NOT NULL,
    assigned_at timestamp(3) without time zone NOT NULL,
    released_at timestamp(3) without time zone,
    release_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.listing_slots OWNER TO iqmonex_user;

--
-- Name: listing_specifications; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.listing_specifications (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    specification_id integer NOT NULL,
    value text NOT NULL,
    unit_id integer,
    is_required boolean DEFAULT true NOT NULL
);


ALTER TABLE public.listing_specifications OWNER TO iqmonex_user;

--
-- Name: listing_user_specifications; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.listing_user_specifications (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    user_specification_id integer NOT NULL,
    value text NOT NULL,
    unit_id integer,
    is_required boolean DEFAULT true NOT NULL
);


ALTER TABLE public.listing_user_specifications OWNER TO iqmonex_user;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.listings (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    category_id integer,
    subcategory_id integer,
    subsubcategory_id integer,
    contact_id uuid,
    contact_type text,
    rating double precision DEFAULT 0,
    reviews_count integer DEFAULT 0 NOT NULL,
    title character varying(255),
    description character varying(3000),
    status public.listing_status DEFAULT 'DRAFT'::public.listing_status NOT NULL,
    is_banned boolean DEFAULT false NOT NULL,
    ban_reason character varying(500),
    price numeric(15,2),
    currency_id integer,
    price_unit_id integer,
    condition public.listing_condition,
    views_count integer DEFAULT 0 NOT NULL,
    favorites_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    archived_reason character varying(1000),
    published_at timestamp(3) without time zone,
    archived_at timestamp(3) without time zone,
    auto_delete_at timestamp(3) without time zone,
    last_used_at timestamp(3) without time zone,
    account_number text DEFAULT ''::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.listings OWNER TO iqmonex_user;

--
-- Name: map_locations; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.map_locations (
    id uuid NOT NULL,
    user_id uuid,
    listing_id uuid,
    type public.map_location_type NOT NULL,
    address text NOT NULL,
    country text NOT NULL,
    city text NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    geo_hash text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.map_locations OWNER TO iqmonex_user;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    message character varying(1000) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    chat_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO iqmonex_user;

--
-- Name: payment_items; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.payment_items (
    id uuid NOT NULL,
    payment_id uuid NOT NULL,
    item_type public.payment_item_type NOT NULL,
    "itemId" uuid NOT NULL,
    item_id_str text,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    description text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payment_items OWNER TO iqmonex_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text NOT NULL,
    status public.payment_status DEFAULT 'PENDING'::public.payment_status NOT NULL,
    external_id character varying(100) NOT NULL,
    provider text NOT NULL,
    description text NOT NULL,
    invoice_id character varying(50),
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO iqmonex_user;

--
-- Name: pinned_chats; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.pinned_chats (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    pinned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pinned_chats OWNER TO iqmonex_user;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    legal_entity_type_id integer,
    currency_id integer NOT NULL,
    avatar_url text,
    phone text,
    email text,
    telegram text,
    site_url text,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.profiles OWNER TO iqmonex_user;

--
-- Name: promo_campaign_participants; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.promo_campaign_participants (
    id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public.promo_participant_status DEFAULT 'PENDING'::public.promo_participant_status NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    condition_reached_at timestamp(3) without time zone,
    condition_lost_at timestamp(3) without time zone,
    free_period_granted boolean DEFAULT false NOT NULL,
    discount_used boolean DEFAULT false NOT NULL,
    discount_available_at timestamp(3) without time zone,
    dropped_out boolean DEFAULT false NOT NULL,
    dropped_out_at timestamp(3) without time zone,
    drop_reason text,
    subscription_id uuid
);


ALTER TABLE public.promo_campaign_participants OWNER TO iqmonex_user;

--
-- Name: promo_campaigns; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.promo_campaigns (
    id uuid NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    status public.promo_campaign_status DEFAULT 'ACTIVE'::public.promo_campaign_status NOT NULL,
    "maxParticipants" integer NOT NULL,
    "currentParticipants" integer DEFAULT 0 NOT NULL,
    initial_free_days integer NOT NULL,
    subsequent_discount integer NOT NULL,
    subsequent_days integer NOT NULL,
    required_active_listings integer DEFAULT 10 NOT NULL,
    required_days integer DEFAULT 7 NOT NULL,
    start_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_at timestamp(3) without time zone,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.promo_campaigns OWNER TO iqmonex_user;

--
-- Name: review_files; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.review_files (
    id uuid NOT NULL,
    review_id uuid NOT NULL,
    s3_key text NOT NULL,
    s3_bucket text NOT NULL,
    url text NOT NULL,
    file_type text NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.review_files OWNER TO iqmonex_user;

--
-- Name: review_likes; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.review_likes (
    id uuid NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.review_likes OWNER TO iqmonex_user;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    author_id uuid NOT NULL,
    target_type public.review_target_type NOT NULL,
    listing_id uuid,
    target_user_id uuid,
    rating integer NOT NULL,
    content character varying(2000) NOT NULL,
    status public.review_status DEFAULT 'PENDING'::public.review_status NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    reports_count integer DEFAULT 0 NOT NULL,
    reply_content character varying(1000),
    reply_at timestamp(3) without time zone,
    reply_author_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO iqmonex_user;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    role text NOT NULL,
    code text NOT NULL,
    type public.role_types NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO iqmonex_user;

--
-- Name: slot_packages; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.slot_packages (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    slots integer NOT NULL,
    price numeric(12,2) NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    payment_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.slot_packages OWNER TO iqmonex_user;

--
-- Name: specifications; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.specifications (
    id integer NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.specifications OWNER TO iqmonex_user;

--
-- Name: specifications_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.specifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.specifications_id_seq OWNER TO iqmonex_user;

--
-- Name: specifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.specifications_id_seq OWNED BY public.specifications.id;


--
-- Name: subscription_periods; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.subscription_periods (
    id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    days integer NOT NULL,
    start_at timestamp(3) without time zone NOT NULL,
    end_at timestamp(3) without time zone NOT NULL,
    payment_id uuid,
    discount_percent integer DEFAULT 0 NOT NULL,
    period_type text DEFAULT 'PAID'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.subscription_periods OWNER TO iqmonex_user;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.subscriptions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    tariff_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    total_slots integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO iqmonex_user;

--
-- Name: tariffs; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.tariffs (
    id uuid NOT NULL,
    code public.tariff_code NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    base_slots integer NOT NULL,
    base_days integer NOT NULL,
    max_total_days integer NOT NULL,
    is_extendable boolean NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    price numeric(12,2) NOT NULL,
    currency_code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tariffs OWNER TO iqmonex_user;

--
-- Name: unit_measurements; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.unit_measurements (
    id integer NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.unit_measurements OWNER TO iqmonex_user;

--
-- Name: unit_measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.unit_measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_measurements_id_seq OWNER TO iqmonex_user;

--
-- Name: unit_measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.unit_measurements_id_seq OWNED BY public.unit_measurements.id;


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.user_activities (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    activity_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_activities OWNER TO iqmonex_user;

--
-- Name: user_notes; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.user_notes (
    id uuid NOT NULL,
    author_id uuid NOT NULL,
    target_type public."UserNoteTargetType" NOT NULL,
    target_user_id uuid,
    target_listing_id uuid,
    content character varying(100) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_notes OWNER TO iqmonex_user;

--
-- Name: user_slots; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.user_slots (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    slot_index integer NOT NULL,
    source_type public.slot_cource NOT NULL,
    source_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    "slotPackageId" uuid,
    "subscriptionId" uuid
);


ALTER TABLE public.user_slots OWNER TO iqmonex_user;

--
-- Name: user_specifications; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.user_specifications (
    id integer NOT NULL,
    name jsonb NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_specifications OWNER TO iqmonex_user;

--
-- Name: user_specifications_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.user_specifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_specifications_id_seq OWNER TO iqmonex_user;

--
-- Name: user_specifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.user_specifications_id_seq OWNED BY public.user_specifications.id;


--
-- Name: user_suggestions; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.user_suggestions (
    id integer NOT NULL,
    text text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_suggestions OWNER TO iqmonex_user;

--
-- Name: user_suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: iqmonex_user
--

CREATE SEQUENCE public.user_suggestions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_suggestions_id_seq OWNER TO iqmonex_user;

--
-- Name: user_suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: iqmonex_user
--

ALTER SEQUENCE public.user_suggestions_id_seq OWNED BY public.user_suggestions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "accountNumber" text NOT NULL,
    password text NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_banned boolean DEFAULT false NOT NULL,
    ban_reason text,
    rating double precision DEFAULT 0,
    reviews_count integer DEFAULT 0 NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO iqmonex_user;

--
-- Name: users_chats; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.users_chats (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chats_id uuid NOT NULL
);


ALTER TABLE public.users_chats OWNER TO iqmonex_user;

--
-- Name: workers; Type: TABLE; Schema: public; Owner: iqmonex_user
--

CREATE TABLE public.workers (
    id uuid NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    is_active boolean NOT NULL,
    role_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.workers OWNER TO iqmonex_user;

--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: category_specifications id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.category_specifications ALTER COLUMN id SET DEFAULT nextval('public.category_specifications_id_seq'::regclass);


--
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: currency_rates id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.currency_rates ALTER COLUMN id SET DEFAULT nextval('public.currency_rates_id_seq'::regclass);


--
-- Name: legal_entity_types id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.legal_entity_types ALTER COLUMN id SET DEFAULT nextval('public.legal_entity_types_id_seq'::regclass);


--
-- Name: specifications id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.specifications ALTER COLUMN id SET DEFAULT nextval('public.specifications_id_seq'::regclass);


--
-- Name: unit_measurements id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.unit_measurements ALTER COLUMN id SET DEFAULT nextval('public.unit_measurements_id_seq'::regclass);


--
-- Name: user_specifications id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_specifications ALTER COLUMN id SET DEFAULT nextval('public.user_specifications_id_seq'::regclass);


--
-- Name: user_suggestions id; Type: DEFAULT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_suggestions ALTER COLUMN id SET DEFAULT nextval('public.user_suggestions_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.activities (id, name, created_at, updated_at) FROM stdin;
101	Юридическое сопровождение бизнеса	2026-04-17 00:07:00.75	2026-04-17 00:07:00.75
102	Судебное представительство	2026-04-17 00:07:00.751	2026-04-17 00:07:00.751
103	Договорная работа	2026-04-17 00:07:00.752	2026-04-17 00:07:00.752
104	Корпоративное право	2026-04-17 00:07:00.753	2026-04-17 00:07:00.753
105	Налоговое право	2026-04-17 00:07:00.754	2026-04-17 00:07:00.754
106	Международное право	2026-04-17 00:07:00.756	2026-04-17 00:07:00.756
107	Интеллектуальная собственность	2026-04-17 00:07:00.756	2026-04-17 00:07:00.756
108	Лицензирование и разрешения	2026-04-17 00:07:00.757	2026-04-17 00:07:00.757
109	Комплаенс и регуляторика	2026-04-17 00:07:00.758	2026-04-17 00:07:00.758
110	Антимонопольное право	2026-04-17 00:07:00.758	2026-04-17 00:07:00.758
111	Банкротство и реструктуризация	2026-04-17 00:07:00.759	2026-04-17 00:07:00.759
201	Бухгалтерское обслуживание	2026-04-17 00:07:00.76	2026-04-17 00:07:00.76
202	Налоговое консультирование	2026-04-17 00:07:00.761	2026-04-17 00:07:00.761
203	Финансовый аудит	2026-04-17 00:07:00.763	2026-04-17 00:07:00.763
204	Управленческий учёт	2026-04-17 00:07:00.764	2026-04-17 00:07:00.764
205	Финансовый консалтинг	2026-04-17 00:07:00.765	2026-04-17 00:07:00.765
206	Инвестиционный консалтинг	2026-04-17 00:07:00.766	2026-04-17 00:07:00.766
207	Корпоративные финансы	2026-04-17 00:07:00.767	2026-04-17 00:07:00.767
208	Казначейские услуги	2026-04-17 00:07:00.769	2026-04-17 00:07:00.769
209	Платёжные решения	2026-04-17 00:07:00.77	2026-04-17 00:07:00.77
210	Эквайринг	2026-04-17 00:07:00.771	2026-04-17 00:07:00.771
211	Финтех-платформы	2026-04-17 00:07:00.772	2026-04-17 00:07:00.772
212	Криптосервисы	2026-04-17 00:07:00.773	2026-04-17 00:07:00.773
213	Страхование бизнеса	2026-04-17 00:07:00.773	2026-04-17 00:07:00.773
214	Страхование грузов	2026-04-17 00:07:00.775	2026-04-17 00:07:00.775
215	Управление рисками	2026-04-17 00:07:00.776	2026-04-17 00:07:00.776
216	Лизинг	2026-04-17 00:07:00.777	2026-04-17 00:07:00.777
217	Факторинг	2026-04-17 00:07:00.777	2026-04-17 00:07:00.777
301	Машиностроение	2026-04-17 00:07:00.778	2026-04-17 00:07:00.778
302	Металлообработка	2026-04-17 00:07:00.779	2026-04-17 00:07:00.779
303	Химическое производство	2026-04-17 00:07:00.779	2026-04-17 00:07:00.779
304	Электронное производство	2026-04-17 00:07:00.78	2026-04-17 00:07:00.78
305	Приборостроение	2026-04-17 00:07:00.78	2026-04-17 00:07:00.78
306	Производство компонентов	2026-04-17 00:07:00.781	2026-04-17 00:07:00.781
307	Контрактное производство	2026-04-17 00:07:00.782	2026-04-17 00:07:00.782
308	Деревообработка	2026-04-17 00:07:00.785	2026-04-17 00:07:00.785
309	Производство стройматериалов	2026-04-17 00:07:00.791	2026-04-17 00:07:00.791
310	Резинотехническое производство	2026-04-17 00:07:00.796	2026-04-17 00:07:00.796
401	Производство одежды	2026-04-17 00:07:00.797	2026-04-17 00:07:00.797
402	Производство обуви	2026-04-17 00:07:00.798	2026-04-17 00:07:00.798
403	Текстильное производство	2026-04-17 00:07:00.8	2026-04-17 00:07:00.8
404	Производство упаковки	2026-04-17 00:07:00.801	2026-04-17 00:07:00.801
405	Производство аксессуаров	2026-04-17 00:07:00.802	2026-04-17 00:07:00.802
406	Частные торговые марки	2026-04-17 00:07:00.803	2026-04-17 00:07:00.803
407	Производство мебели	2026-04-17 00:07:00.804	2026-04-17 00:07:00.804
408	Производство игрушек и товаров для детей	2026-04-17 00:07:00.805	2026-04-17 00:07:00.805
409	Производство бытовой химии	2026-04-17 00:07:00.806	2026-04-17 00:07:00.806
501	Производство продуктов питания	2026-04-17 00:07:00.807	2026-04-17 00:07:00.807
502	Производство напитков	2026-04-17 00:07:00.808	2026-04-17 00:07:00.808
503	Агропереработка	2026-04-17 00:07:00.809	2026-04-17 00:07:00.809
504	Пищевая упаковка	2026-04-17 00:07:00.81	2026-04-17 00:07:00.81
505	Контрактное пищевое производство	2026-04-17 00:07:00.811	2026-04-17 00:07:00.811
506	Производство кормов	2026-04-17 00:07:00.813	2026-04-17 00:07:00.813
507	Производство алкоголя	2026-04-17 00:07:00.815	2026-04-17 00:07:00.815
508	Кондитерское производство	2026-04-17 00:07:00.816	2026-04-17 00:07:00.816
601	Растениеводство	2026-04-17 00:07:00.818	2026-04-17 00:07:00.818
602	Животноводство	2026-04-17 00:07:00.819	2026-04-17 00:07:00.819
603	Птицеводство	2026-04-17 00:07:00.821	2026-04-17 00:07:00.821
604	Рыболовство и аквакультура	2026-04-17 00:07:00.824	2026-04-17 00:07:00.824
605	Агрохолдинги	2026-04-17 00:07:00.827	2026-04-17 00:07:00.827
606	Тепличные хозяйства	2026-04-17 00:07:00.83	2026-04-17 00:07:00.83
607	Пчеловодство	2026-04-17 00:07:00.832	2026-04-17 00:07:00.832
608	Агроснабжение	2026-04-17 00:07:00.833	2026-04-17 00:07:00.833
701	Сырьевые материалы	2026-04-17 00:07:00.834	2026-04-17 00:07:00.834
702	Металлы и сплавы	2026-04-17 00:07:00.836	2026-04-17 00:07:00.836
703	Полимеры и пластики	2026-04-17 00:07:00.837	2026-04-17 00:07:00.837
704	Строительные материалы	2026-04-17 00:07:00.838	2026-04-17 00:07:00.838
705	Химическое сырьё	2026-04-17 00:07:00.838	2026-04-17 00:07:00.838
706	Древесина и продукты переработки	2026-04-17 00:07:00.84	2026-04-17 00:07:00.84
707	Нефтепродукты и топливо	2026-04-17 00:07:00.84	2026-04-17 00:07:00.84
708	Текстильное сырьё	2026-04-17 00:07:00.845	2026-04-17 00:07:00.845
709	Вторичное сырьё и переработка	2026-04-17 00:07:00.846	2026-04-17 00:07:00.846
801	Генеральное строительство	2026-04-17 00:07:00.848	2026-04-17 00:07:00.848
802	Промышленное строительство	2026-04-17 00:07:00.85	2026-04-17 00:07:00.85
803	Коммерческое строительство	2026-04-17 00:07:00.851	2026-04-17 00:07:00.851
804	Инженерные системы	2026-04-17 00:07:00.853	2026-04-17 00:07:00.853
805	Проектирование и архитектура	2026-04-17 00:07:00.856	2026-04-17 00:07:00.856
806	Технический надзор	2026-04-17 00:07:00.86	2026-04-17 00:07:00.86
807	Реконструкция и модернизация	2026-04-17 00:07:00.861	2026-04-17 00:07:00.861
808	Дорожное строительство	2026-04-17 00:07:00.862	2026-04-17 00:07:00.862
809	Ландшафтное проектирование	2026-04-17 00:07:00.864	2026-04-17 00:07:00.864
901	Девелопмент	2026-04-17 00:07:00.865	2026-04-17 00:07:00.865
902	Управление недвижимостью	2026-04-17 00:07:00.867	2026-04-17 00:07:00.867
903	Коммерческая аренда	2026-04-17 00:07:00.868	2026-04-17 00:07:00.868
904	Инвестиционная недвижимость	2026-04-17 00:07:00.869	2026-04-17 00:07:00.869
905	Оценка недвижимости	2026-04-17 00:07:00.87	2026-04-17 00:07:00.87
906	Управление и обслуживание объектов	2026-04-17 00:07:00.871	2026-04-17 00:07:00.871
907	Риэлторские услуги	2026-04-17 00:07:00.871	2026-04-17 00:07:00.871
1001	Грузоперевозки	2026-04-17 00:07:00.873	2026-04-17 00:07:00.873
1002	Экспедирование	2026-04-17 00:07:00.874	2026-04-17 00:07:00.874
1003	Складская логистика	2026-04-17 00:07:00.875	2026-04-17 00:07:00.875
1004	3PL (аутсорсинг склада и доставки)	2026-04-17 00:07:00.876	2026-04-17 00:07:00.876
1005	4PL (полный аутсорсинг логистики)	2026-04-17 00:07:00.876	2026-04-17 00:07:00.876
1006	Таможенное оформление	2026-04-17 00:07:00.877	2026-04-17 00:07:00.877
1007	Управление цепочкой поставок	2026-04-17 00:07:00.878	2026-04-17 00:07:00.878
1008	Фулфилмент	2026-04-17 00:07:00.878	2026-04-17 00:07:00.878
1009	Курьерские и экспресс-сервисы	2026-04-17 00:07:00.879	2026-04-17 00:07:00.879
1010	Холодная цепочка	2026-04-17 00:07:00.88	2026-04-17 00:07:00.88
1101	Автомобильные перевозки	2026-04-17 00:07:00.88	2026-04-17 00:07:00.88
1102	Железнодорожные перевозки	2026-04-17 00:07:00.881	2026-04-17 00:07:00.881
1103	Морские перевозки	2026-04-17 00:07:00.882	2026-04-17 00:07:00.882
1104	Авиационные перевозки	2026-04-17 00:07:00.883	2026-04-17 00:07:00.883
1105	Аренда спецтехники	2026-04-17 00:07:00.884	2026-04-17 00:07:00.884
1106	Техническое обслуживание транспорта	2026-04-17 00:07:00.885	2026-04-17 00:07:00.885
1107	Продажа транспорта	2026-04-17 00:07:00.885	2026-04-17 00:07:00.885
1108	Аренда транспорта	2026-04-17 00:07:00.886	2026-04-17 00:07:00.886
1201	B2B-дистрибуция	2026-04-17 00:07:00.886	2026-04-17 00:07:00.886
1202	Импорт / экспорт	2026-04-17 00:07:00.887	2026-04-17 00:07:00.887
1203	Контрактные поставки	2026-04-17 00:07:00.888	2026-04-17 00:07:00.888
1204	Торговые дома	2026-04-17 00:07:00.888	2026-04-17 00:07:00.888
1205	Оптовые поставщики	2026-04-17 00:07:00.889	2026-04-17 00:07:00.889
1206	Параллельный импорт	2026-04-17 00:07:00.891	2026-04-17 00:07:00.891
1207	Кросс-докинг	2026-04-17 00:07:00.892	2026-04-17 00:07:00.892
1301	Корпоративные закупки	2026-04-17 00:07:00.892	2026-04-17 00:07:00.892
1302	Тендерное сопровождение	2026-04-17 00:07:00.893	2026-04-17 00:07:00.893
1303	Поиск поставщиков	2026-04-17 00:07:00.894	2026-04-17 00:07:00.894
1304	Управление категориями товаров	2026-04-17 00:07:00.895	2026-04-17 00:07:00.895
1305	Аутсорсинг снабжения	2026-04-17 00:07:00.895	2026-04-17 00:07:00.895
1306	Тендерные площадки	2026-04-17 00:07:00.896	2026-04-17 00:07:00.896
1401	Разработка ПО	2026-04-17 00:07:00.896	2026-04-17 00:07:00.896
1402	Веб-разработка	2026-04-17 00:07:00.897	2026-04-17 00:07:00.897
1403	Мобильные приложения	2026-04-17 00:07:00.898	2026-04-17 00:07:00.898
1404	Корпоративные IT-системы	2026-04-17 00:07:00.898	2026-04-17 00:07:00.898
1405	SaaS (облачное ПО по подписке)	2026-04-17 00:07:00.899	2026-04-17 00:07:00.899
1406	IT-аутсорсинг	2026-04-17 00:07:00.9	2026-04-17 00:07:00.9
1407	Облачные сервисы	2026-04-17 00:07:00.901	2026-04-17 00:07:00.901
1408	Хостинг и дата-центры	2026-04-17 00:07:00.901	2026-04-17 00:07:00.901
1409	DevOps (объединение разработки)	2026-04-17 00:07:00.902	2026-04-17 00:07:00.902
1410	Кибербезопасность	2026-04-17 00:07:00.902	2026-04-17 00:07:00.902
1411	Сетевые решения	2026-04-17 00:07:00.903	2026-04-17 00:07:00.903
1412	IT-поддержка и сопровождение	2026-04-17 00:07:00.903	2026-04-17 00:07:00.903
1413	Телекоммуникации и корпоративная связь	2026-04-17 00:07:00.904	2026-04-17 00:07:00.904
1414	Интернет-провайдеры	2026-04-17 00:07:00.905	2026-04-17 00:07:00.905
1415	Интеграция систем	2026-04-17 00:07:00.906	2026-04-17 00:07:00.906
1416	Блокчейн-решения	2026-04-17 00:07:00.906	2026-04-17 00:07:00.906
1501	Аналитика данных	2026-04-17 00:07:00.907	2026-04-17 00:07:00.907
1502	Большие данные	2026-04-17 00:07:00.908	2026-04-17 00:07:00.908
1503	Искусственный интеллект	2026-04-17 00:07:00.909	2026-04-17 00:07:00.909
1504	Машинное обучение	2026-04-17 00:07:00.909	2026-04-17 00:07:00.909
1505	RPA (роботизированная автоматизация)	2026-04-17 00:07:00.91	2026-04-17 00:07:00.91
1506	BI-системы (бизнес-аналитика)	2026-04-17 00:07:00.911	2026-04-17 00:07:00.911
1507	IoT (Интернет вещей)	2026-04-17 00:07:00.911	2026-04-17 00:07:00.911
1508	Цифровые двойники	2026-04-17 00:07:00.912	2026-04-17 00:07:00.912
1509	Промышленная автоматизация	2026-04-17 00:07:00.912	2026-04-17 00:07:00.912
1601	B2B-маркетинг	2026-04-17 00:07:00.913	2026-04-17 00:07:00.913
1602	Цифровой маркетинг	2026-04-17 00:07:00.914	2026-04-17 00:07:00.914
1603	SEO (поисковая оптимизация)	2026-04-17 00:07:00.914	2026-04-17 00:07:00.914
1604	SMM (продвижение в соцсетях)	2026-04-17 00:07:00.915	2026-04-17 00:07:00.915
1605	PR (связи с общественностью)	2026-04-17 00:07:00.916	2026-04-17 00:07:00.916
1606	Лидогенерация	2026-04-17 00:07:00.918	2026-04-17 00:07:00.918
1607	Работа с маркетплейсами	2026-04-17 00:07:00.919	2026-04-17 00:07:00.919
1608	Email-маркетинг	2026-04-17 00:07:00.919	2026-04-17 00:07:00.919
1609	Контент-маркетинг	2026-04-17 00:07:00.921	2026-04-17 00:07:00.921
1610	Аутсорсинг отдела продаж	2026-04-17 00:07:00.921	2026-04-17 00:07:00.921
1701	Брендинг	2026-04-17 00:07:00.922	2026-04-17 00:07:00.922
1702	Графический дизайн	2026-04-17 00:07:00.923	2026-04-17 00:07:00.923
1703	UX / UI (проектирование интерфейса)	2026-04-17 00:07:00.923	2026-04-17 00:07:00.923
1704	Промышленный дизайн	2026-04-17 00:07:00.924	2026-04-17 00:07:00.924
1705	Motion-дизайн (анимированная графика)	2026-04-17 00:07:00.924	2026-04-17 00:07:00.924
1706	Дизайн упаковки	2026-04-17 00:07:00.925	2026-04-17 00:07:00.925
1707	3D-визуализация	2026-04-17 00:07:00.925	2026-04-17 00:07:00.925
1708	Фото- и видеопроизводство	2026-04-17 00:07:00.926	2026-04-17 00:07:00.926
1709	Копирайтинг (написание текстов)	2026-04-17 00:07:00.927	2026-04-17 00:07:00.927
1801	Подбор персонала	2026-04-17 00:07:00.927	2026-04-17 00:07:00.927
1802	HR-аутсорсинг (передача внешней компании)	2026-04-17 00:07:00.928	2026-04-17 00:07:00.928
1803	Кадровый консалтинг	2026-04-17 00:07:00.929	2026-04-17 00:07:00.929
1804	Корпоративное обучение	2026-04-17 00:07:00.929	2026-04-17 00:07:00.929
1805	HR-Tech (технологии управления персоналом)	2026-04-17 00:07:00.93	2026-04-17 00:07:00.93
1806	Аутстаффинг (персонал в аренду)	2026-04-17 00:07:00.931	2026-04-17 00:07:00.931
1807	Оценка и аттестация персонала	2026-04-17 00:07:00.931	2026-04-17 00:07:00.931
1808	Охрана труда	2026-04-17 00:07:00.932	2026-04-17 00:07:00.932
1901	Корпоративные курсы и тренинги	2026-04-17 00:07:00.932	2026-04-17 00:07:00.932
1902	Онлайн-обучение	2026-04-17 00:07:00.933	2026-04-17 00:07:00.933
1903	Профессиональная переподготовка	2026-04-17 00:07:00.933	2026-04-17 00:07:00.933
1904	EdTech (технологии в образовании)	2026-04-17 00:07:00.934	2026-04-17 00:07:00.934
1905	MBA (деловое администрирования)	2026-04-17 00:07:00.935	2026-04-17 00:07:00.935
1906	Языковые курсы	2026-04-17 00:07:00.935	2026-04-17 00:07:00.935
1907	Сертификация и аккредитация	2026-04-17 00:07:00.936	2026-04-17 00:07:00.936
2001	Медицинские услуги	2026-04-17 00:07:00.937	2026-04-17 00:07:00.937
2002	Фармацевтическое производство	2026-04-17 00:07:00.937	2026-04-17 00:07:00.937
2003	Медицинское оборудование	2026-04-17 00:07:00.938	2026-04-17 00:07:00.938
2004	Лабораторная диагностика	2026-04-17 00:07:00.938	2026-04-17 00:07:00.938
2005	Корпоративная медицина и ДМС	2026-04-17 00:07:00.939	2026-04-17 00:07:00.939
2006	Телемедицина (онлайн-консультации врачей)	2026-04-17 00:07:00.939	2026-04-17 00:07:00.939
2007	Санитария и дезинфекция	2026-04-17 00:07:00.941	2026-04-17 00:07:00.941
2101	Охрана объектов (ЧОП)	2026-04-17 00:07:00.941	2026-04-17 00:07:00.941
2102	Видеонаблюдение и СКУД	2026-04-17 00:07:00.942	2026-04-17 00:07:00.942
2103	Пожарная безопасность	2026-04-17 00:07:00.943	2026-04-17 00:07:00.943
2104	Инкассация	2026-04-17 00:07:00.943	2026-04-17 00:07:00.943
2105	Тревожные кнопки и мониторинг	2026-04-17 00:07:00.944	2026-04-17 00:07:00.944
2106	Консалтинг по безопасности	2026-04-17 00:07:00.944	2026-04-17 00:07:00.944
2201	Поставки для ресторанов и кафе	2026-04-17 00:07:00.945	2026-04-17 00:07:00.945
2202	Кейтеринг (выездное питание)	2026-04-17 00:07:00.945	2026-04-17 00:07:00.945
2203	Гостиничный бизнес	2026-04-17 00:07:00.946	2026-04-17 00:07:00.946
2204	Оборудование для общепита	2026-04-17 00:07:00.946	2026-04-17 00:07:00.946
2205	Корпоративное питание	2026-04-17 00:07:00.948	2026-04-17 00:07:00.948
2206	Вендинг (торговые автоматы)	2026-04-17 00:07:00.949	2026-04-17 00:07:00.949
2301	Полиграфия (печатная продукция)	2026-04-17 00:07:00.95	2026-04-17 00:07:00.95
2302	Издательское дело	2026-04-17 00:07:00.95	2026-04-17 00:07:00.95
2303	СМИ и медиапроизводство	2026-04-17 00:07:00.951	2026-04-17 00:07:00.951
2304	Организация мероприятий	2026-04-17 00:07:00.952	2026-04-17 00:07:00.952
2305	Выставки и конференции	2026-04-17 00:07:00.952	2026-04-17 00:07:00.952
2306	Наружная реклама	2026-04-17 00:07:00.953	2026-04-17 00:07:00.953
2307	Сувенирная и промо-продукция	2026-04-17 00:07:00.954	2026-04-17 00:07:00.954
2401	Клининговые услуги	2026-04-17 00:07:00.955	2026-04-17 00:07:00.955
2402	Техническое обслуживание оборудования	2026-04-17 00:07:00.955	2026-04-17 00:07:00.955
2403	Обслуживание зданий и территорий	2026-04-17 00:07:00.956	2026-04-17 00:07:00.956
2404	BPO (Аутсорсинг бизнес-процессов)	2026-04-17 00:07:00.957	2026-04-17 00:07:00.957
2405	Переводческие услуги	2026-04-17 00:07:00.958	2026-04-17 00:07:00.958
2406	Нотариальные и апостильные услуги	2026-04-17 00:07:00.958	2026-04-17 00:07:00.958
2407	Клиентский сервис и колл-центры	2026-04-17 00:07:00.959	2026-04-17 00:07:00.959
2501	Энергоснабжение	2026-04-17 00:07:00.96	2026-04-17 00:07:00.96
2502	Возобновляемая энергетика	2026-04-17 00:07:00.96	2026-04-17 00:07:00.96
2503	Энергоаудит (оценка)	2026-04-17 00:07:00.961	2026-04-17 00:07:00.961
2504	Инженерные энергосистемы	2026-04-17 00:07:00.961	2026-04-17 00:07:00.961
2505	Нефтегазовая отрасль	2026-04-17 00:07:00.962	2026-04-17 00:07:00.962
2506	Торговля электроэнергией	2026-04-17 00:07:00.963	2026-04-17 00:07:00.963
2507	Резервное электроснабжение	2026-04-17 00:07:00.963	2026-04-17 00:07:00.963
2601	Утилизация отходов	2026-04-17 00:07:00.964	2026-04-17 00:07:00.964
2602	Переработка	2026-04-17 00:07:00.965	2026-04-17 00:07:00.965
2603	Экологический консалтинг	2026-04-17 00:07:00.965	2026-04-17 00:07:00.965
2604	ESG-отчётность (экология)	2026-04-17 00:07:00.966	2026-04-17 00:07:00.966
2605	Углеродный учёт	2026-04-17 00:07:00.967	2026-04-17 00:07:00.967
2606	Рекультивация территорий	2026-04-17 00:07:00.967	2026-04-17 00:07:00.967
2607	Водоочистка и водоподготовка	2026-04-17 00:07:00.968	2026-04-17 00:07:00.968
2701	Научные исследования	2026-04-17 00:07:00.968	2026-04-17 00:07:00.968
2702	R&D-центры (центры исследований)	2026-04-17 00:07:00.969	2026-04-17 00:07:00.969
2703	Инженерные разработки	2026-04-17 00:07:00.97	2026-04-17 00:07:00.97
2704	Прототипирование	2026-04-17 00:07:00.971	2026-04-17 00:07:00.971
2705	DeepTech (Глубокие технологии)	2026-04-17 00:07:00.972	2026-04-17 00:07:00.972
2706	Биотехнологии	2026-04-17 00:07:00.973	2026-04-17 00:07:00.973
2707	Сертификация продукции	2026-04-17 00:07:00.974	2026-04-17 00:07:00.974
2708	Испытательные лаборатории	2026-04-17 00:07:00.975	2026-04-17 00:07:00.975
2801	Стратегический консалтинг	2026-04-17 00:07:00.975	2026-04-17 00:07:00.975
2802	Управленческий консалтинг	2026-04-17 00:07:00.976	2026-04-17 00:07:00.976
2803	Операционный консалтинг	2026-04-17 00:07:00.977	2026-04-17 00:07:00.977
2804	Бизнес-аналитика	2026-04-17 00:07:00.977	2026-04-17 00:07:00.977
2805	Антикризисное управление	2026-04-17 00:07:00.978	2026-04-17 00:07:00.978
2806	M&A (слияния компаний)	2026-04-17 00:07:00.979	2026-04-17 00:07:00.979
2807	Франчайзинг	2026-04-17 00:07:00.98	2026-04-17 00:07:00.98
2808	Стартап-консалтинг	2026-04-17 00:07:00.98	2026-04-17 00:07:00.98
2901	Государственные закупки	2026-04-17 00:07:00.981	2026-04-17 00:07:00.981
2902	Работа с НКО	2026-04-17 00:07:00.982	2026-04-17 00:07:00.982
2903	Социальное предпринимательство	2026-04-17 00:07:00.983	2026-04-17 00:07:00.983
2904	Субсидии и гранты	2026-04-17 00:07:00.985	2026-04-17 00:07:00.985
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.categories (id, name, "parentId") FROM stdin;
1	Готовый бизнес	\N
2	IT (информационные технологии) и цифровые решения	1
3	CRM-системы (управление клиентами)	2
4	ERP-системы (управление предприятием)	2
5	Бухгалтерские решения	2
6	Аналитические платформы	2
7	SaaS (облачное ПО по подписке)	2
8	Лицензии на ПО (программное обеспечение)	2
9	Серверы и хостинг	2
10	S3-хранилища (облачное хранение данных)	2
11	Телефония / SIP (интернет-телефония)	2
12	Системы мониторинга	2
13	VPS (виртуальный выделенный сервер)	2
14	Чат-боты и автоматизации	2
15	Маркетплейсы (торговые площадки)	2
16	Сайты / лендинги (посадочные страницы)	2
17	Мобильные приложения	2
18	Корпоративные системы	2
19	Прочее	2
20	Бизнес-процессы и операционные комплексы	1
21	Магазины (готовый бизнес)	20
22	Кафе / рестораны	20
23	Производственные бизнесы	20
24	Онлайн-проекты	20
25	Логистические компании	20
26	Колл-центры (центры приёма звонков)	20
27	Отдел продаж	20
28	Отдел маркетинга	20
29	HR (управление персоналом) - процессы	20
30	Финансовые модели / учёт	20
31	Скрипты и регламенты	20
32	Готовый арендный бизнес (ГАБ - объект с арендаторами)	20
33	Прочее	20
34	Торговые точки и имущество бизнеса	1
35	Коммерческая недвижимость с оборудованием	34
36	Помещения с установленным производством	34
37	Оборудованные кафе / кофейни	34
38	Оборудованные магазины	34
39	Оборудованные офисы	34
40	Окна выдачи / пункты самовывоза	34
41	Прочее	34
42	Документы, лицензии и права	1
43	Медицинские лицензии	42
44	Фармацевтические лицензии	42
45	Алкогольные лицензии	42
46	Транспортные лицензии	42
47	Лицензии на недропользование	42
48	Торговые марки	42
49	Патенты	42
50	Авторские права	42
51	Готовые ООО	42
52	Юрлица с историей	42
53	Прочее	42
54	Поставщики, контракты, франшизы	1
55	Контракты с поставщиками	54
56	Дистрибьюторские (дилерские) соглашения	54
57	Договоры на обслуживание	54
58	Действующие франшизные точки	54
59	Нестартовые комплекты франшизы	54
60	Продажа доли во франшизе	54
61	Прочее	54
62	Недвижимость	\N
63	Недвижимость	62
64	Офисы	63
65	Торговые площади	63
66	Склады и логистические центры	63
67	Производственные помещения	63
68	Помещения общепита	63
69	Автосервисы и паркинги	63
70	Помещения свободного назначения	63
71	Целые здания и комплексы	63
72	Земельные участки	63
73	Гостиницы и хостелы	63
74	Дата-центры	63
75	Энергетические и промышленные объекты	63
76	Объекты хранения	63
77	Готовая продукция	\N
78	Электроника и бытовая техника	77
79	Смартфоны и планшеты	78
80	Ноутбуки и компьютеры	78
81	Комплектующие и аксессуары	78
82	Телевизоры и аудиотехника	78
83	Фото- и видеотехника	78
84	Игровая и развлекательная электроника	78
85	Умные устройства	78
86	Навигация и автоэлектроника	78
87	Безопасность и видеонаблюдение	78
88	Климат и вентиляция	78
89	Бытовая и офисная техника	78
90	Освещение	78
91	Прочее	78
92	Одежда, обувь и аксессуары	77
93	Верхняя одежда женская	92
94	Верхняя одежда мужская	92
95	Верхняя одежда детская	92
96	Обувь женская	92
97	Обувь мужская	92
98	Обувь детская	92
99	Нижнее бельё и домашняя одежда женская	92
100	Нижнее бельё и домашняя одежда мужская	92
101	Нижнее бельё и домашняя одежда детская	92
102	Спортивная и уличная одежда женская	92
103	Спортивная и уличная одежда мужская	92
104	Спортивная и уличная одежда детская	92
105	Форменная и рабочая одежда	92
106	Аксессуары	92
107	Средства ухода за одеждой	92
108	Прочее	92
109	Мебель и интерьер	77
110	Мебель для дома	109
111	Мебель для кухни и столовой	109
112	Офисная и коммерческая мебель	109
113	Входные и межкомнатные двери	109
114	Стулья, кресла, табуреты	109
115	Мебель для ванных и прихожих	109
116	Специальная мебель для HoReCa (общепит и гостиницы) и торговых точек	109
117	Декор и предметы интерьера	109
118	Прочее	109
119	Текстиль и ткани	77
120	Постельные принадлежности	119
121	Текстиль для кухни и столовой	119
122	Полотенца и банный текстиль	119
123	Одеяла, подушки, наматрасники	119
124	Декоративный текстиль и шторы	119
125	Ткани	119
126	Прочее	119
127	Товары для красоты и ухода	77
128	Уход за волосами	127
129	Уход за кожей лица и тела	127
130	Маникюр и педикюр	127
131	Макияж	127
132	Парфюмерия	127
133	Бьюти-гаджеты (приборы для красоты) и аксессуары	127
134	Прочее	127
135	Товары для здоровья и медицина	77
136	Медицинские расходные материалы	135
137	Лекарственные средства	135
138	Гигиена	135
139	Витамины, БАДы	135
140	Оптика	135
141	Ортопедия	135
142	Стоматология	135
143	Приборы и массажёры	135
144	Медицинские аксессуары	135
145	Прочее	135
146	Детские товары	77
147	Игрушки	146
148	Товары для школы и творчества	146
149	Гигиена и уход за детьми	146
150	Коляски, кроватки, автокресла	146
151	Товары для мам и малышей	146
152	Детская одежда и обувь	146
153	Прочее	146
154	Спорт и активный отдых	77
155	Велосипеды и самокаты	154
156	Туризм, кемпинг, досуг	154
157	Тренажёры и фитнес	154
158	Боевые и силовые виды спорта	154
159	Товары для водного спорта	154
160	Зимний спорт	154
161	Хобби и моделизм	154
162	Прочее	154
163	Сад, дача и хозтовары	77
164	Садовая техника и инструменты	163
165	Мебель и обустройство для сада	163
166	Семена и растения	163
167	Системы полива и водоснабжения	163
168	Бани, сауны и термозоны	163
169	Хозяйственные товары	163
170	Декор и ландшафт	163
171	Прочее	163
172	Авто- и мототовары	77
173	Автозапчасти	172
174	Шины и диски	172
175	Автохимия и уход	172
176	Электроника для авто	172
177	Автомобильные аксессуары	172
178	Прочее	172
179	Книги, канцелярия и печатная продукция	77
180	Книги и справочники	179
181	Журналы и периодика	179
182	Канцелярия и расходники	179
183	Упаковочные и макулатурные изделия	179
184	Прочее	179
185	Товары для животных	77
186	Корма	185
187	Амуниция и одежда для животных	185
188	Игрушки для животных	185
189	Гигиена и ветеринария	185
190	Домики и мебель для животных	185
191	Оборудование и аксессуары для животных	185
192	Прочее	185
193	Ювелирные изделия и часы	77
194	Ювелирные украшения	193
195	Бижутерия	193
196	Часы наручные и настенные	193
197	Сувениры и подарки	193
198	Прочее	193
199	Музыкальные инструменты и звук	77
200	Музыкальные инструменты	199
201	Профессиональное звуковое оборудование	199
202	Аксессуары для музыкантов	199
203	Прочее	199
204	Зоотовары и товары для природы	77
205	Аквариумы и террариумы	204
206	Товары для птиц	204
207	Фермерские принадлежности	204
208	Прочее	204
209	Промышленное и производственное оборудование	77
210	Станки и обрабатывающие центры	209
211	Прессы, штамповочное оборудование	209
212	Сварочное оборудование	209
213	Компрессоры и насосы	209
214	Конвейеры и транспортёры	209
215	Промышленные роботы и манипуляторы	209
216	Печи, сушки, термооборудование	209
217	Прочее	209
218	Пищевое и перерабатывающее оборудование	77
219	Линии переработки и фасовки	218
220	Холодильное и морозильное оборудование	218
221	Пекарное и кондитерское оборудование	218
222	Оборудование для мясопереработки	218
223	Оборудование для производства напитков	218
224	Упаковочные линии	218
225	Прочее	218
226	Торговое оборудование	77
227	Стеллажи и торговые системы хранения	226
228	Холодильные витрины и горки	226
229	Кассовые аппараты	226
230	Вендинговые (торговые) автоматы	226
231	Лайтбоксы (световые короба), стойки, мерч-оборудование	226
232	Оборудование для примерочных и шоу-румов	226
233	Прочее	226
234	Медицинское и фармацевтическое оборудование	77
235	Диагностическое оборудование	234
236	Хирургическое и операционное оборудование	234
237	Реабилитационное оборудование	234
238	Лабораторное оборудование	234
239	Аптечное и фармацевтическое оборудование	234
240	Прочее	234
241	Строительное и дорожное оборудование	77
242	Бетономешалки и бетонные насосы	241
243	Вышки, леса строительные, опалубка	241
244	Дорожно-строительное оборудование	241
245	Геодезическое и измерительное оборудование	241
246	Прочее	241
247	Энергетическое оборудование	77
248	Солнечные панели и инверторы	247
249	Дизельные и газовые генераторы	247
250	ИБП	247
251	Трансформаторы и подстанции	247
252	Ветрогенераторы	247
253	Системы накопления энергии	247
254	Прочее	247
255	Офисное и IT-оборудование	77
256	Серверы и сетевое оборудование	255
257	Рабочие станции	255
258	Принтеры, МФУ, копиры	255
259	Системы видеонаблюдения и СКУД	255
260	Офисная мебель	255
261	Прочее	255
262	Сельскохозяйственная техника и оборудование	77
263	Тракторы	262
264	Комбайны	262
265	Посевная и почвообрабатывающая техника	262
266	Прицепное и навесное оборудование	262
267	Техника для животноводства и кормопроизводства	262
268	Оросительные системы	262
269	Прочее	262
270	Транспорт и спецтехника	\N
271	Легковой и малотоннажный транспорт	270
272	Легковые автомобили	271
273	Лёгкий коммерческий транспорт	271
274	Мототехника	271
275	Автодома и дома на колёсах	271
276	Прочее	271
277	Грузовая и тяговая техника	270
278	Среднетоннажные и тяжёлые грузовики	277
279	Тягачи	277
280	Прицепы и полуприцепы	277
281	Вездеходы и спецтранспорт повышенной проходимости	277
282	Прочее	277
283	Пассажирская техника	270
284	Автобусы	283
285	Микроавтобусы	283
286	Вахтовки и школьные автобусы	283
287	Прочее	283
288	Строительная и промышленная техника	270
289	Экскаваторы	288
290	Бульдозеры	288
291	Погрузчики	288
292	Автокраны и манипуляторы	288
293	Асфальтоукладчики и дорожная техника	288
294	Прочее	288
295	Горнодобывающая техника	270
296	Карьерные самосвалы	295
297	Дробильное и сортировочное оборудование	295
298	Шахтное оборудование	295
299	Перфораторы и буровые установки	295
300	Прочее	295
301	Коммунальная и уборочная техника	270
302	Подметально-уборочные машины	301
303	Мусоровозы	301
304	Поливомоечные и снегоуборочные машины	301
305	Спецтехника ЖКХ	301
306	Прочее	301
307	Складская и логистическая техника	270
308	Погрузчики	307
309	Штабелёры, ричтраки	307
310	Тележки и транспортировщики	307
311	Подъёмное оборудование	307
312	Прочее	307
313	Водный, воздушный и рельсовый транспорт	270
314	Водный транспорт	313
315	Авиационная техника	313
316	Железнодорожная техника	313
317	Прочее	313
318	Сельское хозяйство	\N
319	Животноводческая продукция (сырьё)	318
320	Животные и птица (на убой)	319
321	Рыба и водные животные (живые)	319
322	Насекомые	319
323	Яйца (столовые, инкубационные)	319
324	Молоко (сырое, непастеризованное)	319
325	Пчеловодческая продукция	319
326	Прочее	319
327	Растительная продукция (сырьё)	318
328	Зерновые культуры	327
329	Бобовые культуры	327
330	Масличные культуры	327
331	Корнеплоды и клубнеплоды	327
332	Овощи свежие	327
333	Фрукты	327
334	Ягоды	327
335	Орехи	327
336	Грибы культивируемые	327
337	Декоративные культуры	327
338	Посевной и посадочный материал	327
339	Прочее	327
340	Корма и кормовые ингредиенты	318
341	Комбикорма готовые и премиксы	340
342	Ингредиенты для кормов	340
343	Сено, солома, силос	340
344	Жмых, шрот, отруби, барда	340
345	Мука кормовая	340
346	Заменители цельного молока	340
347	Пробиотики и кормовые добавки	340
348	Корма для рыб, водных животных и насекомых	340
349	Прочее	340
350	Агрохимия и биопрепараты	318
351	Минеральные удобрения	350
352	Органические и органоминеральные удобрения	350
353	Микроудобрения	350
354	Регуляторы роста растений	350
355	Средства защиты растений	350
356	Биопрепараты	350
357	Грунты и почвенные субстраты	350
358	Средства дезинсекции и дератизации	350
359	Прочее	350
360	Продукты первичной переработки	318
361	Замороженные овощи, фрукты, ягоды	360
362	Сушёные плоды, овощи, зелень	360
363	Крупы и мука	360
364	Масложировая продукция	360
365	Мясо и субпродукты охлаждённые / замороженные	360
366	Рыбная продукция переработанная (филе, заморозка)	360
367	Прочее	360
368	Сырьё и промышленность	\N
369	Металлы и сплавы	368
370	Чёрные металлы	369
371	Цветные металлы	369
372	Сплавы и полуфабрикаты	369
373	Листы, трубы, профили	369
374	Металлолом и вторсырьё	369
375	Прочее	369
376	Нефтепродукты и топливо	368
377	Сырая нефть и природный газ	376
378	Мазут, дизель, керосин	376
379	Бензин, топливо для котлов	376
380	Печное и авиационное топливо	376
381	Битум, смолы	376
382	Прочее	376
383	Химическое сырьё	368
384	Кислоты, щёлочи, соли	383
385	Органические и неорганические соединения	383
386	Пищевые добавки и консерванты	383
387	Химикаты для производства пластмасс, стекла, удобрений	383
388	Реагенты и растворители	383
389	Прочее	383
390	Минеральное и горнорудное сырьё	368
391	Руды	390
392	Минералы	390
393	Гранит, известняк, мрамор	390
394	Песок, гравий, щебень	390
395	Сыпучие строительные материалы	390
396	Прочее	390
397	Лес и древесина	368
398	Кругляк (брёвна), пиломатериалы	397
399	Брус, доска, фанера	397
400	МДФ, ДСП, ОСБ	397
401	Щепа, опилки, древесные отходы	397
402	Лесоматериалы специального назначения	397
403	Прочее	397
404	Пластмассы и полимеры	368
405	Гранулы (ПЭ, ПП, ПВХ, АБС)	404
406	Плёнки и листы	404
407	Композиционные материалы	404
408	Смолы и герметики	404
409	Вторичные полимеры и переработка	404
410	Прочее	404
411	Текстильное и кожевенное сырьё	368
412	Натуральные волокна	411
413	Синтетические нити и волокна	411
414	Ткань-основа и подкладки	411
415	Кожа натуральная и искусственная	411
416	Войлок, нетканые материалы	411
417	Прочее	411
418	Строительные материалы (промышленные партии)	368
419	Цемент, гипс, известь	418
420	Блоки, кирпич, ЖБИ	418
421	Кровельные и фасадные материалы	418
422	Изоляционные материалы	418
423	Сухие строительные смеси	418
424	Прочее	418
425	Упаковочные материалы	368
426	Плёнки, биг-бэги, стрейч	425
427	Картон, гофрокартон, тубы	425
428	Мешки, ящики, поддоны	425
429	Этикетки, ленты, пломбы	425
430	Упаковка для пищевой и промышленной продукции	425
431	Прочее	425
432	Энергетические и тепловые ресурсы	368
433	Электроэнергия	432
434	Уголь	432
435	Пеллеты, брикеты	432
436	Биоэнергетическое сырьё	432
437	Газ в баллонах и сжиженный	432
438	Прочее	432
439	Промышленные газы	368
440	Кислород, азот, аргон	439
441	Пропан, бутан	439
442	Углекислый газ (CO₂)	439
443	Специализированные газовые смеси	439
444	Сжиженные и сжатые газы	439
445	Прочее	439
446	Промышленные комплектующие и узлы	368
447	Резиновые уплотнители, прокладки	446
448	Промышленные подшипники	446
449	Фланцы, соединительные элементы	446
450	Комплектующие для насосов, станков, вентиляции	446
451	Механизмы, приводы, редукторы	446
452	Прочее	446
453	Электроника и электротехника	368
454	Кабели, провода	453
455	Контроллеры, платы, микросхемы	453
456	Электродвигатели	453
457	Датчики, реле, автоматы	453
458	Электронные модули для промышленных систем	453
459	Прочее	453
460	Переработанные и вторичные материалы	368
461	Металлолом, вторичный пластик	460
462	Макулатура, отходы бумаги	460
463	Переработанный текстиль	460
464	Строительные отходы	460
465	Компост и биоматериалы	460
466	Прочее	460
467	Прочие промышленные товары	368
468	Смазки, технические масла	467
469	Абразивы	467
470	Средства очистки и обезжиривания	467
471	Расходники для оборудования	467
472	Уникальные и редкие материалы под заказ	467
473	Прочее	467
474	Продукты питания	\N
475	Мясная продукция	474
476	Колбасы, сосиски, сардельки	475
477	Бекон, ветчина, паштеты	475
478	Копчёности и вяленое мясо	475
479	Фарши и мясные полуфабрикаты	475
480	Субпродукты (печень, почки, сердце и пр.)	475
481	Холодцы, рулеты и мясные нарезки	475
482	Прочее	475
483	Рыбная и морская продукция	474
484	Филе и тушки	483
485	Икра и рыбные деликатесы	483
486	Кальмары, мидии, креветки	483
487	Рыбные полуфабрикаты	483
488	Сушёная и вяленая рыба	483
489	Морская капуста и пресервы (рыба в маринаде)	483
490	Прочее	483
491	Молочные продукты	474
492	Сыры (твёрдые, мягкие, плавленые)	491
493	Масло сливочное	491
494	Творог, сырковые массы	491
495	Сухое молоко, сливки	491
496	Молоко и сливки (жидкие)	491
497	Кефир, ряженка, простокваша	491
498	Йогурты	491
499	Безлактозные альтернативы	491
500	Прочее	491
501	Замороженные продукты	474
502	Мясо и полуфабрикаты	501
503	Овощи, ягоды, грибы	501
504	Рыба и морепродукты	501
505	Тесто и выпечка	501
506	Замороженные готовые блюда	501
507	Мороженое и десерты	501
508	Прочее	501
509	Консервация и пресервы	474
510	Овощные и фруктовые консервы	509
511	Мясные и рыбные консервы	509
512	Морепродукты в масле / рассоле	509
513	Бобовые и суповые заготовки	509
514	Готовые блюда в консервах	509
515	Соленья и маринады	509
516	Прочее	509
517	Хлебобулочные изделия	474
518	Хлеб упакованный, нарезной	517
519	Булочки, круассаны, питы, лаваши	517
520	Хлебцы и хлебные снеки (лёгкие закуски)	517
521	Замороженные хлебобулочные заготовки	517
522	Прочее	517
523	Кондитерские изделия	474
524	Конфеты, шоколад	523
525	Вафли, печенье, пряники	523
526	Торты и пирожные (фабричные)	523
527	Мармелад, зефир, пастила	523
528	Промышленные кремы, коржи и основы для выпечки	523
529	Прочее	523
530	Крупы, мука, макароны	474
531	Рис, гречка, пшено и другие крупы	530
532	Мука	530
533	Макаронные изделия	530
534	Смеси для выпечки	530
535	Каши в HoReCa (общепит)- в упаковке	530
536	Прочее	530
537	Соусы, специи и приправы	474
538	Соусы	537
539	Заправки и маринады	537
540	Сухие приправы и специи	537
541	Горчица, хрен, аджика	537
542	Соусы и специи в упаковке HoReCa (общепит)	537
543	Прочее	537
544	Базовые пищевые ингредиенты	474
545	Сахар, соль	544
546	Яйцо	544
547	Масла растительные и сливочное	544
548	Дрожжи, закваски	544
549	Желатин, пектин, агар-агар	544
550	Прочее	544
551	Концентраты и пищевые добавки	474
552	Бульонные кубики и концентраты	551
553	Ароматизаторы и усилители вкуса	551
554	Пищевые красители	551
555	Подсластители (заменители сахара)	551
556	Стабилизаторы, эмульгаторы	551
557	Белковые концентраты и заменители	551
558	Прочее	551
559	Напитки безалкогольные	474
560	Бутилированная вода	559
561	Газированные напитки	559
562	Соки и нектары	559
563	Энергетические и функциональные напитки	559
564	Лимонады, квас	559
565	Тоники, напитки для баров	559
566	Прочее	559
567	Кофе, чай, какао	474
568	Зерновой и молотый кофе	567
569	Чай	567
570	Кофейные смеси 3-в-1	567
571	Какао и горячий шоколад	567
572	Сиропы и добавки для напитков	567
573	Прочее	567
574	Алкогольная продукция	474
575	Пиво и сидры	574
576	Вино и шампанское	574
577	Крепкий алкоголь	574
578	Коктейльные заготовки	574
579	HoReCa (общепит) алкоголь	574
580	Безалкогольное пиво и вино	574
581	Прочее	574
582	Специальное и функциональное питание	474
583	Диетические продукты	582
584	Безглютеновые и безлактозные продукты	582
585	Веганские альтернативы	582
586	Продукты для аллергиков	582
587	Спортивное питание	582
588	Детское питание	582
589	Прочее	582
590	Снеки (лёгкие закуски) и перекус	474
591	Чипсы, сухарики	590
592	Орехи и сухофрукты	590
593	Батончики	590
594	Крекеры, сушки	590
595	Протеиновые снеки	590
596	Прочее	590
597	HoReCa (общепит) и кейтеринг (выездное обслуживание)	474
598	Готовые блюда и полуфабрикаты для общепита	597
599	Выпечка и десерты для HoReCa (общепита)	597
600	Продукция для кейтеринга (выездного питания) и банкетов	597
601	Канапе, тарталетки, finger food (еда руками)	597
602	Индивидуальная фасовка порций	597
603	Прочее	597
604	Прочие пищевые продукты	474
605	Национальные и этнические продукты	604
606	Экзотические товары	604
607	Продукты с уникальными свойствами	604
608	Прочее	604
609	Услуги	\N
610	IT (информационные технологии) и разработка	609
611	Разработка программного обеспечения (ПО)	610
612	Веб-разработка и создание сайтов	610
613	Мобильная разработка	610
614	UX/UI-дизайн (проектирование интерфейса)	610
615	Интеграция CRM (управление клиентами) / ERP (управление предприятием)-систем	610
616	Поддержка и обслуживание IT-инфраструктуры	610
617	Облачные решения и хостинг (размещение данных)	610
618	Кибербезопасность (защита от цифровых угроз)	610
619	DevOps (объединение разработки и операций) и администрирование серверов	610
620	Тестирование ПО и QA (контроль качества)	610
621	Блокчейн (цепочка блоков) и Web3 (децентрализованный интернет)-решения	610
622	Искусственный интеллект (ИИ) и автоматизация	610
623	Прочее	610
624	Маркетинг, реклама и PR (связи с общественностью)	609
625	Цифровой маркетинг (SMM (соцсети), контекст, таргетинг (нацеленная реклама))	624
626	SEO (поисковая оптимизация сайта)	624
627	Брендинг и фирменный стиль	624
628	Копирайтинг (написание текстов) и контент-маркетинг	624
629	Видеомаркетинг и продакшн (производство видео)	624
630	Организация мероприятий	624
631	PR (связи с общественностью) и коммуникации	624
632	E-mail и мессенджер-маркетинг	624
633	Работа с маркетплейсами (торговыми площадками)	624
634	Аналитика и стратегии продвижения	624
635	Дизайн упаковки и визуальные коммуникации	624
636	Прочее	624
637	Финансы и бухгалтерия	609
638	Бухгалтерское обслуживание	637
639	Аудит (проверка финансовой отчётности) и ревизия	637
640	Налоговое консультирование	637
641	Финансовый аутсорсинг (передача функций внешней компании)	637
642	Управленческий учёт и планирование	637
643	Кадровый учёт и расчёт зарплат	637
644	Регистрация юрлиц и ИП	637
645	Ликвидация и реорганизация бизнеса	637
646	Прочее	637
647	Финансовые продукты и страхование	609
648	Лизинг оборудования и транспорта	647
649	Факторинг (финансирование под уступку долга)	647
650	Торговое финансирование	647
651	Страхование бизнеса и имущества	647
652	Страхование грузов	647
653	ДМС для сотрудников	647
654	Инвестиционные продукты для бизнеса	647
655	Прочее	647
656	Юридические услуги	609
657	Корпоративное право	656
658	Составление и анализ договоров	656
659	Судебное представительство	656
660	Трудовое право	656
661	Интеллектуальная собственность	656
662	Лицензирование и разрешительная документация	656
663	Комплаенс и правовой аудит	656
664	Арбитраж и взыскания	656
665	Прочее	656
666	Логистика и склад	609
667	Грузоперевозки	666
668	Международная логистика	666
669	Таможенное оформление	666
670	Экспедирование	666
671	Складские услуги и фулфилмент (хранение и отправка заказов)	666
672	Услуги карго (грузовая доставка)	666
673	Курьерская доставка	666
674	Переезды и транспортировка оборудования	666
675	Прочее	666
676	Производственные и технические услуги	609
677	Техническое обслуживание и ремонт оборудования	676
678	Монтаж и запуск оборудования	676
679	Строительно-монтажные работы	676
680	Инжиниринг и проектирование	676
681	Промышленная автоматизация	676
682	Калибровка, испытания, сертификация	676
683	Услуги ЧПУ и 3D-печати	676
684	Аренда техники и оборудования	676
685	Прочее	676
686	Безопасность и охрана	609
687	Охрана объектов (ЧОП)	686
688	Системы видеонаблюдения (монтаж как услуга)	686
689	СКУД (системы контроля и управления доступом)	686
690	Инкассация и перевозка ценностей	686
691	Пожарная безопасность и аудит	686
692	Консультации по информационной безопасности	686
693	Прочее	686
694	Консалтинг (консультирование) и обучение	609
695	Бизнес-консалтинг	694
696	Стратегическое планирование	694
697	Консалтинг по экспорту / импорту	694
698	Обучение сотрудников	694
699	Корпоративные тренинги	694
700	HR (управление персоналом)-консалтинг	694
701	Менторинг (наставничество)	694
702	Lean (бережливое производство), Scrum (спринтовое управление проектами)-внедрение	694
703	Прочее	694
704	Экология и утилизация	609
705	Утилизация промышленных отходов	704
706	Переработка вторсырья	704
707	Экологический аудит и консалтинг	704
708	Рекультивация территорий	704
709	Химическая нейтрализация отходов	704
710	Медицинская утилизация	704
711	Прочее	704
712	Энергетика и инженерные системы	609
713	Монтаж солнечных панелей и инверторов	712
714	Установка генераторов и ИБП	712
715	Электрораспределение и щитовое оборудование	712
716	Котельное оборудование и теплоснабжение	712
717	Системы водоснабжения и очистки воды	712
718	Системы АСУТП	712
719	Прочее	712
720	Медицинские корпоративные услуги	609
721	ДМС и корпоративное медобслуживание	720
722	Медосмотры и вакцинация сотрудников	720
723	Телемедицина (онлайн-консультации врачей) для бизнеса	720
724	Психологическая поддержка сотрудников	720
725	Прочее	720
726	Креатив и медиа	609
727	Фото- и видеосъёмка	726
728	Моушн-дизайн (дизайн в движении)	726
729	Анимация и VFX (визуальные спецэффекты)	726
730	Продюсирование контента (производство материалов)	726
731	3D-визуализация	726
732	Иллюстрация и графика	726
733	Музыкальное оформление	726
734	Прочее	726
735	Прочие услуги	609
736	Уборка, клининг, дезинфекция	735
737	Рекрутинговые услуги (подбор персонала)	735
738	Аутстаффинг (аренда персонала у другой компании)	735
739	Колл-центр (центр приёма звонков) и телемаркетинг	735
740	Услуги переводчиков	735
741	Исследования и опросы	735
742	Тайный покупатель / аудит офлайн-точек	735
743	Полиграфия (печатная продукция) и печать	735
744	Корпоративный кейтеринг (доставка питания в офисы)	735
745	Прочее	735
\.


--
-- Data for Name: category_specifications; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.category_specifications (id, category_id, specification_id, is_required, default_unit_id) FROM stdin;
\.


--
-- Data for Name: chat_files; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.chat_files (id, mime_type, upload_status, user_id, chat_id, expires_at, file_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: chat_participants; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.chat_participants (id, user_id, chat_id, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.chats (id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.complaints (id, "complaintType", type, text, author_id, listing_id, target_user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.currencies (id, symbol, code, name) FROM stdin;
1	₽	RUB	{"en": "Russian Ruble", "kz": "Ресей рублі", "ru": "Российский рубль"}
2	Br	BYN	{"en": "Belarusian Ruble", "kz": "Беларусь рублі", "ru": "Белорусский рубль"}
3	₸	KZT	{"en": "Kazakhstani Tenge", "kz": "Қазақстан теңгесі", "ru": "Казахстанский тенге"}
4	$	USD	{"en": "US Dollar", "kz": "АҚШ доллары", "ru": "Доллар США"}
5	€	EUR	{"en": "Euro", "kz": "Еуро", "ru": "Евро"}
6	¥	CNY	{"en": "Chinese Yuan", "kz": "Қытай юані", "ru": "Китайский юань"}
\.


--
-- Data for Name: currency_rates; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.currency_rates (id, code, nominal, rate, date) FROM stdin;
8	RUB	1	1.0000	2026-04-18
9	BYN	1	26.8352	2026-04-18
10	USD	1	76.0535	2026-04-18
11	EUR	1	89.6256	2026-04-18
12	KZT	100	16.1315	2026-04-18
13	CNY	1	11.1457	2026-04-18
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.donations (id, user_id, amount, currency, comment, status, payment_id, created_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.favorites (id, user_id, type, listing_id, target_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.files (id, owner_type, s3_key, s3_bucket, url, file_type, file_name, file_size, kind, is_primary, sort_order, upload_status, expires_at, created_at, updated_at, user_id, listing_id, complaint_id, worker_id, suggestion_id) FROM stdin;
5ff25d14-c023-4a00-a224-2c90fc5c32c9	LISTING	listings/fa5b0517-9cdd-4c72-84df-f61e6ff095df/document-0-1776583283767-ucgljb	adverts	https://storage.clo.ru/adverts/listings/fa5b0517-9cdd-4c72-84df-f61e6ff095df/document-0-1776583283767-ucgljb	application/vnd.openxmlformats-officedocument.wordprocessingml.document	document_0_1776583283767_z4eubv.docx	23755	DOCUMENT	t	0	completed	\N	2026-04-19 07:21:23.772	2026-04-19 07:21:24.127	\N	fa5b0517-9cdd-4c72-84df-f61e6ff095df	\N	\N	\N
31498cfd-68b7-4e32-8901-0ed1087b6bd8	LISTING	listings/fa5b0517-9cdd-4c72-84df-f61e6ff095df/photo-0-1776583283795-knrlmo	adverts	https://storage.clo.ru/adverts/listings/fa5b0517-9cdd-4c72-84df-f61e6ff095df/photo-0-1776583283795-knrlmo	image/jpeg	photo_0_1776583283795_hh3qud.jpg	15167	PHOTO	t	0	completed	\N	2026-04-19 07:21:23.801	2026-04-19 07:21:24.394	\N	fa5b0517-9cdd-4c72-84df-f61e6ff095df	\N	\N	\N
f94b15bf-aaa4-4453-b323-d552deeb064d	USER	users/c663a8f9-3618-4941-9419-e89c1c5964d0/photos/photo_0_1776583235136_4u56rd.jpg	adverts	https://storage.clo.ru/adverts/users/c663a8f9-3618-4941-9419-e89c1c5964d0/photos/photo_0_1776583235136_4u56rd.jpg	image/png	photo_0_1776583235136_tv9qhy.png	66221	PHOTO	t	0	completed	\N	2026-04-19 07:20:35.14	2026-04-19 07:23:08.776	c663a8f9-3618-4941-9419-e89c1c5964d0	\N	\N	\N	\N
\.


--
-- Data for Name: legal_entity_types; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.legal_entity_types (id, data, created_at, updated_at) FROM stdin;
1	{"en": {"code": "LLC", "name": "Limited Liability Company"}, "kz": {"code": "ЖШС", "name": "Жауапкершілігі шектеулі серіктестік"}, "ru": {"code": "ООО", "name": "Общество с ограниченной ответственностью"}}	2026-04-17 00:07:00.731	2026-04-17 00:07:00.731
2	{"en": {"code": "JSC", "name": "Joint Stock Company"}, "kz": {"code": "АҚ", "name": "Акционерлік қоғам"}, "ru": {"code": "АО", "name": "Акционерное общество"}}	2026-04-17 00:07:00.733	2026-04-17 00:07:00.733
3	{"en": {"code": "PJSC", "name": "Public Joint Stock Company"}, "kz": {"code": "ЖАҚ", "name": "Жария акционерлік қоғам"}, "ru": {"code": "ПАО", "name": "Публичное акционерное общество"}}	2026-04-17 00:07:00.735	2026-04-17 00:07:00.735
4	{"en": {"code": "IE", "name": "Individual Entrepreneur"}, "kz": {"code": "ЖК", "name": "Жеке кәсіпкер"}, "ru": {"code": "ИП", "name": "Индивидуальный предприниматель"}}	2026-04-17 00:07:00.736	2026-04-17 00:07:00.736
5	{"en": {"code": "SUE", "name": "State Unitary Enterprise"}, "kz": {"code": "МУК", "name": "Мемлекеттік унитарлық кәсіпорын"}, "ru": {"code": "ГУП", "name": "Государственное унитарное предприятие"}}	2026-04-17 00:07:00.737	2026-04-17 00:07:00.737
6	{"en": {"code": "MUE", "name": "Municipal Unitary Enterprise"}, "kz": {"code": "КУК", "name": "Коммуналдық унитарлық кәсіпорын"}, "ru": {"code": "МУП", "name": "Муниципальное унитарное предприятие"}}	2026-04-17 00:07:00.737	2026-04-17 00:07:00.737
7	{"en": {"code": "NPO", "name": "Non-Profit Organization"}, "kz": {"code": "КО", "name": "Коммерциялық емес ұйым"}, "ru": {"code": "НКО", "name": "Некоммерческая организация"}}	2026-04-17 00:07:00.738	2026-04-17 00:07:00.738
8	{"en": {"code": "ANO", "name": "Autonomous Non-Profit Organization"}, "kz": {"code": "АКО", "name": "Автономиялық коммерциялық емес ұйым"}, "ru": {"code": "АНО", "name": "Автономная некоммерческая организация"}}	2026-04-17 00:07:00.739	2026-04-17 00:07:00.739
9	{"en": {"code": "Foundation", "name": "Foundation"}, "kz": {"code": "Қор", "name": "Қор"}, "ru": {"code": "Фонд", "name": "Фонд"}}	2026-04-17 00:07:00.741	2026-04-17 00:07:00.741
10	{"en": {"code": "Institution", "name": "Institution"}, "kz": {"code": "Мекеме", "name": "Мекеме"}, "ru": {"code": "Учреждение", "name": "Учреждение"}}	2026-04-17 00:07:00.742	2026-04-17 00:07:00.742
11	{"en": {"code": "Religious", "name": "Religious Organization"}, "kz": {"code": "Діни ұйым", "name": "Діни ұйым"}, "ru": {"code": "Религиозная организация", "name": "Религиозная организация"}}	2026-04-17 00:07:00.743	2026-04-17 00:07:00.743
12	{"en": {"code": "BA", "name": "Bar Association"}, "kz": {"code": "АК", "name": "Адвокаттар алқасы"}, "ru": {"code": "КА", "name": "Коллегия адвокатов"}}	2026-04-17 00:07:00.744	2026-04-17 00:07:00.744
13	{"en": {"code": "NC", "name": "Notarial Chamber"}, "kz": {"code": "НП", "name": "Нотариалдық палата"}, "ru": {"code": "НП", "name": "Нотариальная палата"}}	2026-04-17 00:07:00.745	2026-04-17 00:07:00.745
14	{"en": {"code": "HOA", "name": "Homeowners Association"}, "kz": {"code": "МС", "name": "Мүлік иелерінің серіктестігі"}, "ru": {"code": "ТСН", "name": "Товарищество собственников недвижимости"}}	2026-04-17 00:07:00.746	2026-04-17 00:07:00.746
15	{"en": {"code": "GNT", "name": "Gardening Non-Profit Partnership"}, "kz": {"code": "БС", "name": "Бағбаншылық серіктестік"}, "ru": {"code": "СНТ", "name": "Садоводческое некоммерческое товарищество"}}	2026-04-17 00:07:00.746	2026-04-17 00:07:00.746
\.


--
-- Data for Name: listing_likes; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.listing_likes (id, listing_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: listing_slots; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.listing_slots (id, listing_id, user_slot_id, assigned_at, released_at, release_reason, created_at, updated_at) FROM stdin;
8e3d5a14-26fb-4759-8c1c-2e244442d963	fa5b0517-9cdd-4c72-84df-f61e6ff095df	53fc1e2b-69c5-4546-a5c3-a890d95adc95	2026-04-19 07:21:23.75	\N	\N	2026-04-19 07:21:23.751	2026-04-19 07:21:23.751
\.


--
-- Data for Name: listing_specifications; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.listing_specifications (id, listing_id, specification_id, value, unit_id, is_required) FROM stdin;
d6929048-e8b2-4935-95e6-1d529385e48c	fa5b0517-9cdd-4c72-84df-f61e6ff095df	1	asdf	\N	t
bb9a5cd6-a5a7-4154-9083-aa001f0b3051	fa5b0517-9cdd-4c72-84df-f61e6ff095df	2	asdf	\N	t
89a2c1f8-de54-445d-a86d-d810fd69a4bc	fa5b0517-9cdd-4c72-84df-f61e6ff095df	3	asfd	\N	t
8bbab0ca-4132-4aff-b43d-15a29dc93a53	fa5b0517-9cdd-4c72-84df-f61e6ff095df	4	asf	\N	t
b40dd98b-6f6a-40b6-8465-d3a67364fd4d	fa5b0517-9cdd-4c72-84df-f61e6ff095df	6	asdf	\N	t
\.


--
-- Data for Name: listing_user_specifications; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.listing_user_specifications (id, listing_id, user_specification_id, value, unit_id, is_required) FROM stdin;
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.listings (id, user_id, category_id, subcategory_id, subsubcategory_id, contact_id, contact_type, rating, reviews_count, title, description, status, is_banned, ban_reason, price, currency_id, price_unit_id, condition, views_count, favorites_count, likes_count, version, archived_reason, published_at, archived_at, auto_delete_at, last_used_at, account_number, created_at, updated_at) FROM stdin;
fa5b0517-9cdd-4c72-84df-f61e6ff095df	c663a8f9-3618-4941-9419-e89c1c5964d0	1	34	37	c663a8f9-3618-4941-9419-e89c1c5964d0	USER	0	0	asdf	asdfasdf	PUBLISHED	f	\N	150000.00	1	1	USED	2	0	0	0	\N	\N	\N	\N	\N	97229622	2026-04-19 07:21:23.726	2026-04-19 07:23:42.426
\.


--
-- Data for Name: map_locations; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.map_locations (id, user_id, listing_id, type, address, country, city, latitude, longitude, geo_hash, created_at, "updatedAt") FROM stdin;
69723b44-a4a8-4fa6-9397-e08229d16a8d	c663a8f9-3618-4941-9419-e89c1c5964d0	\N	OFFICE	Москва, Вознесенский переулок, 125375	Россия	Москва	55.75803140	37.60383560	ucftpwqq0	2026-04-19 07:20:35.527	2026-04-19 07:20:35.527
25d99aa4-418a-4250-b744-51fffebb98e4	\N	fa5b0517-9cdd-4c72-84df-f61e6ff095df	OFFICE	Москва, Вознесенский переулок, 125375	Россия	Москва	55.75803140	37.60383560	ucftpwq	2026-04-19 07:21:23.758	2026-04-19 07:21:23.758
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.messages (id, sender_id, message, is_read, chat_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_items; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.payment_items (id, payment_id, item_type, "itemId", item_id_str, quantity, unit_price, description, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.payments (id, user_id, amount, currency, status, external_id, provider, description, invoice_id, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pinned_chats; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.pinned_chats (id, user_id, chat_id, pinned_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.profiles (id, user_id, legal_entity_type_id, currency_id, avatar_url, phone, email, telegram, site_url, description, created_at, updated_at) FROM stdin;
e3e17878-3297-41d0-a30f-1c1c204b7a27	c663a8f9-3618-4941-9419-e89c1c5964d0	2	3	\N	+375292769407	test@gmail.com	@nickname	https://localhost.com	asdfasdfasdf	2026-04-19 07:17:33.981	2026-04-19 07:23:08.73
\.


--
-- Data for Name: promo_campaign_participants; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.promo_campaign_participants (id, campaign_id, user_id, status, joined_at, condition_reached_at, condition_lost_at, free_period_granted, discount_used, discount_available_at, dropped_out, dropped_out_at, drop_reason, subscription_id) FROM stdin;
edf57ee2-bd13-44fd-94ca-c4535ce983bf	b0b158e1-eafc-4b0f-9668-b28721236a03	c663a8f9-3618-4941-9419-e89c1c5964d0	PENDING	2026-04-19 07:17:34.032	\N	\N	t	f	2027-04-14 07:17:34.118	f	\N	\N	19126f07-feba-4912-a07c-959437184e63
\.


--
-- Data for Name: promo_campaigns; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.promo_campaigns (id, code, name, status, "maxParticipants", "currentParticipants", initial_free_days, subsequent_discount, subsequent_days, required_active_listings, required_days, start_at, end_at, is_locked, created_at, updated_at) FROM stdin;
94aabdea-17a9-4769-b636-f0598e419df6	WELCOME_2000	Приветственная акция - Следующие 2000 пользователей	CANCELED	2000	0	30	50	360	10	7	2026-04-17 00:07:00.725	\N	f	2026-04-17 00:07:00.725	2026-04-17 00:07:00.725
b0b158e1-eafc-4b0f-9668-b28721236a03	WELCOME_300	Приветственная акция - Первые 300 пользователей	ACTIVE	300	1	360	50	360	10	7	2026-04-17 00:07:00.72	\N	f	2026-04-17 00:07:00.72	2026-04-19 07:17:34.085
\.


--
-- Data for Name: review_files; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.review_files (id, review_id, s3_key, s3_bucket, url, file_type, file_name, file_size, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: review_likes; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.review_likes (id, review_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.reviews (id, author_id, target_type, listing_id, target_user_id, rating, content, status, likes_count, reports_count, reply_content, reply_at, reply_author_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.roles (id, role, code, type, created_at, updated_at) FROM stdin;
386b8bce-0b93-4d02-a1fe-8036fbc62d3d	Супер администратор	SUPER_ADMIN	ADMIN	2026-04-17 00:06:58.762	2026-04-17 00:06:58.762
e02982a3-8b93-4e98-8658-307ec132af10	Пользователь	USER	USER	2026-04-17 00:06:58.822	2026-04-17 00:06:58.822
0194eb5a-f9ac-4861-b1dd-901b36b0701c	Премиум	USER_PREMIUM	USER	2026-04-17 00:06:58.832	2026-04-17 00:06:58.832
f3880ab6-6414-4a8c-a690-dc6a9bf27521	Администратор	ADMIN	WORKER	2026-04-17 00:06:58.838	2026-04-17 00:06:58.838
9d5a91de-2cb2-4f06-b147-e7212a22678b	Модератор	MODERATOR	WORKER	2026-04-17 00:06:58.842	2026-04-17 00:06:58.842
149e0aa2-28c8-4a40-b456-3e5f4bba34b7	Поддержка	SUPPORT	WORKER	2026-04-17 00:06:58.852	2026-04-17 00:06:58.852
ee8c3240-fcc2-49f8-bd6a-b2fe76392f97	Монтажёр	INSTALLER	WORKER	2026-04-17 00:06:58.859	2026-04-17 00:06:58.859
f6a07bbe-18e6-4b09-9601-f51fd52fb412	Менеджер	MANAGER	WORKER	2026-04-17 00:06:58.862	2026-04-17 00:06:58.862
b578626d-d981-4c28-b3b3-b06e3ca04154	Финансы	FINANCE	WORKER	2026-04-17 00:06:58.869	2026-04-17 00:06:58.869
\.


--
-- Data for Name: slot_packages; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.slot_packages (id, user_id, slots, price, expires_at, is_active, payment_id, created_at) FROM stdin;
\.


--
-- Data for Name: specifications; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.specifications (id, name) FROM stdin;
1	{"en": "Color", "kz": "Түс", "ru": "Цвет"}
2	{"en": "Size", "kz": "Өлшем", "ru": "Размер"}
3	{"en": "Weight", "kz": "Салмақ", "ru": "Вес"}
4	{"en": "Material", "kz": "Материал", "ru": "Материал"}
5	{"en": "Brand", "kz": "Бренд", "ru": "Бренд"}
6	{"en": "Model", "kz": "Модель", "ru": "Модель"}
7	{"en": "Year", "kz": "Шығарылған жылы", "ru": "Год выпуска"}
8	{"en": "Condition", "kz": "Күйі", "ru": "Состояние"}
9	{"en": "Warranty", "kz": "Кепілдік", "ru": "Гарантия"}
10	{"en": "Manufacturer", "kz": "Өндіруші", "ru": "Производитель"}
11	{"en": "Country", "kz": "Ел", "ru": "Страна"}
12	{"en": "SKU", "kz": "Артикул", "ru": "Артикул"}
13	{"en": "Package contents", "kz": "Жинақтама", "ru": "Комплектация"}
\.


--
-- Data for Name: subscription_periods; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.subscription_periods (id, subscription_id, days, start_at, end_at, payment_id, discount_percent, period_type, created_at) FROM stdin;
9e6aea94-53d1-493f-bfe0-06b1b945a87a	19126f07-feba-4912-a07c-959437184e63	360	2026-04-19 07:17:34.118	2027-04-14 07:17:34.118	\N	100	FREE	2026-04-19 07:17:34.125
3279fbb9-207c-41a1-bd3a-b230c885a11f	19126f07-feba-4912-a07c-959437184e63	360	2027-04-14 07:17:34.118	2028-04-08 07:17:34.118	\N	50	DISCOUNTED	2026-04-19 07:17:34.128
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.subscriptions (id, user_id, tariff_id, is_active, total_slots, created_at, updated_at) FROM stdin;
19126f07-feba-4912-a07c-959437184e63	c663a8f9-3618-4941-9419-e89c1c5964d0	51c70636-67ca-429c-b397-c175c47641bc	t	100	2026-04-19 07:17:34.12	2026-04-19 07:17:34.12
\.


--
-- Data for Name: tariffs; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.tariffs (id, code, name, description, base_slots, base_days, max_total_days, is_extendable, is_active, price, currency_code, created_at, updated_at) FROM stdin;
51c70636-67ca-429c-b397-c175c47641bc	BASE	Базавая подписка	Базовая подписка с 100 слотами	100	30	365	t	t	500.00	RUB	2026-04-17 00:07:00.709	2026-04-17 00:07:00.709
18b26bce-473a-4444-b0ef-b7eac48cf12f	ADDITIONAL_PACKAGE	Дополнительный слот	Дополнительный слот для размещения лота	100	30	365	t	t	500.00	RUB	2026-04-17 00:07:00.714	2026-04-17 00:07:00.714
\.


--
-- Data for Name: unit_measurements; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.unit_measurements (id, name) FROM stdin;
1	{"en": "per piece", "kz": "дана", "ru": "за штуку"}
2	{"en": "per unit", "kz": "бірлік", "ru": "за единицу"}
3	{"en": "per set", "kz": "жиынтық", "ru": "за комплект"}
4	{"en": "per kit", "kz": "жиынтық", "ru": "за набор"}
5	{"en": "per package", "kz": "орама", "ru": "за упаковку"}
6	{"en": "per box", "kz": "қорап", "ru": "за коробку"}
7	{"en": "per pallet", "kz": "паллет", "ru": "за паллету"}
8	{"en": "per container", "kz": "контейнер", "ru": "за контейнер"}
9	{"en": "per batch", "kz": "партия", "ru": "за партию"}
10	{"en": "per print run", "kz": "тираж", "ru": "за тираж"}
11	{"en": "per copy", "kz": "дана", "ru": "за экземпляр"}
12	{"en": "per license", "kz": "лицензия", "ru": "за лицензию"}
13	{"en": "per ticket", "kz": "билет", "ru": "за билет"}
14	{"en": "per seat", "kz": "орын", "ru": "за место"}
15	{"en": "per slot", "kz": "слот", "ru": "за слот"}
16	{"en": "per order", "kz": "тапсырыс", "ru": "за заказ"}
17	{"en": "per milligram (mg)", "kz": "миллиграмм", "ru": "за миллиграмм (мг)"}
18	{"en": "per gram (g)", "kz": "грамм", "ru": "за грамм (г)"}
19	{"en": "per kilogram (kg)", "kz": "килограмм", "ru": "за килограмм (кг)"}
20	{"en": "per centner", "kz": "центнер", "ru": "за центнер"}
21	{"en": "per ton (t)", "kz": "тонна", "ru": "за тонну (т)"}
22	{"en": "per ounce (oz)", "kz": "унция", "ru": "за унцию (oz)"}
23	{"en": "per troy ounce", "kz": "троя унциясы", "ru": "за тройскую унцию"}
24	{"en": "per pound (lb)", "kz": "фунт", "ru": "за фунт (lb)"}
25	{"en": "per milliliter (ml)", "kz": "миллилитр", "ru": "за миллилитр (мл)"}
26	{"en": "per liter (l)", "kz": "литр", "ru": "за литр (л)"}
27	{"en": "per hectoliter", "kz": "гектолитр", "ru": "за гектолитр"}
28	{"en": "per barrel", "kz": "баррель", "ru": "за баррель"}
29	{"en": "per gallon", "kz": "галлон", "ru": "за галлон"}
30	{"en": "per millimeter (mm)", "kz": "миллиметр", "ru": "за миллиметр (мм)"}
31	{"en": "per centimeter (cm)", "kz": "сантиметр", "ru": "за сантиметр (см)"}
32	{"en": "per meter (m)", "kz": "метр", "ru": "за метр (м)"}
33	{"en": "per linear meter", "kz": "жүгіртпе метр", "ru": "за погонный метр"}
34	{"en": "per kilometer (km)", "kz": "километр", "ru": "за километр (км)"}
35	{"en": "per inch", "kz": "дюйм", "ru": "за дюйм"}
36	{"en": "per foot", "kz": "фут", "ru": "за фут"}
37	{"en": "per square meter (m²)", "kz": "шаршы метр", "ru": "за квадратный метр (м²)"}
38	{"en": "per hectare", "kz": "гектар", "ru": "за гектар"}
39	{"en": "per acre", "kz": "акр", "ru": "за акр"}
40	{"en": "per minute", "kz": "минут", "ru": "за минуту"}
41	{"en": "per hour", "kz": "сағат", "ru": "за час"}
42	{"en": "per shift", "kz": "ауысым", "ru": "за смену"}
43	{"en": "per day", "kz": "күн", "ru": "за день"}
44	{"en": "per week", "kz": "апта", "ru": "за неделю"}
45	{"en": "per month", "kz": "ай", "ru": "за месяц"}
46	{"en": "per year", "kz": "жыл", "ru": "за год"}
47	{"en": "per employee", "kz": "қызметкер", "ru": "за сотрудника"}
48	{"en": "per user", "kz": "пайдаланушы", "ru": "за пользователя"}
49	{"en": "per subscriber", "kz": "жазылушы", "ru": "за подписчика"}
50	{"en": "per request", "kz": "сұраныс", "ru": "за запрос"}
51	{"en": "per transaction", "kz": "транзакция", "ru": "за транзакцию"}
52	{"en": "per gigabyte", "kz": "гигабайт", "ru": "за гигабайт"}
53	{"en": "per kilometer", "kz": "километр", "ru": "за километр"}
54	{"en": "per ton-kilometer", "kz": "тонна-километр", "ru": "за тонно-километр"}
55	{"en": "per trip", "kz": "рейс", "ru": "за рейс"}
56	{"en": "per delivery", "kz": "жеткізу", "ru": "за доставку"}
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.user_activities (id, user_id, activity_id, created_at, updated_at) FROM stdin;
c66c1c93-bebc-4967-b68c-0064ceca9a95	c663a8f9-3618-4941-9419-e89c1c5964d0	101	2026-04-19 07:20:35.213	2026-04-19 07:23:08.818
6a87ed7b-6299-4866-9129-d29e8aeb1656	c663a8f9-3618-4941-9419-e89c1c5964d0	104	2026-04-19 07:20:35.367	2026-04-19 07:23:08.824
b4d35ba9-7037-4e4f-9b0a-6f76577efc89	c663a8f9-3618-4941-9419-e89c1c5964d0	106	2026-04-19 07:20:35.412	2026-04-19 07:23:08.828
daca9010-6ce0-459b-af22-e9e848126aca	c663a8f9-3618-4941-9419-e89c1c5964d0	107	2026-04-19 07:20:35.441	2026-04-19 07:23:08.832
3110387b-addf-47fe-849b-7c857641c3bf	c663a8f9-3618-4941-9419-e89c1c5964d0	108	2026-04-19 07:20:35.467	2026-04-19 07:23:08.839
\.


--
-- Data for Name: user_notes; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.user_notes (id, author_id, target_type, target_user_id, target_listing_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_slots; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.user_slots (id, user_id, slot_index, source_type, source_id, created_at, expires_at, "slotPackageId", "subscriptionId") FROM stdin;
53fc1e2b-69c5-4546-a5c3-a890d95adc95	c663a8f9-3618-4941-9419-e89c1c5964d0	1	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
2b54abcd-d614-43bb-ba90-41be834ff111	c663a8f9-3618-4941-9419-e89c1c5964d0	2	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7b50fe5f-d0c7-4f9f-abc0-ce3cb5655c6e	c663a8f9-3618-4941-9419-e89c1c5964d0	3	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
04b58c1e-cc76-4c29-a271-75d89e2ffb69	c663a8f9-3618-4941-9419-e89c1c5964d0	4	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9110064f-6bcf-4698-9730-6f67e2e6a5c0	c663a8f9-3618-4941-9419-e89c1c5964d0	5	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7b1c1b57-60aa-4293-a89e-2efea3064871	c663a8f9-3618-4941-9419-e89c1c5964d0	6	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
366541d7-e4a6-4e37-a51f-cc4d07e54747	c663a8f9-3618-4941-9419-e89c1c5964d0	7	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
25fdde72-cd1b-4ae6-8e9c-7119a4a8253d	c663a8f9-3618-4941-9419-e89c1c5964d0	8	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
e0019aea-db62-47c0-9f38-e31d04e61118	c663a8f9-3618-4941-9419-e89c1c5964d0	9	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
376d9524-b493-435e-811a-c72e47259b15	c663a8f9-3618-4941-9419-e89c1c5964d0	10	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7532f41a-4059-4ee6-855f-30488df1cc22	c663a8f9-3618-4941-9419-e89c1c5964d0	11	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
56b9100c-99f8-43a4-9478-7935dea1d2c1	c663a8f9-3618-4941-9419-e89c1c5964d0	12	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9cf63aab-aba3-44d6-9c42-8fe58c9c5d8d	c663a8f9-3618-4941-9419-e89c1c5964d0	13	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d115c43a-44b3-4a6c-903f-d4e4c69a39e5	c663a8f9-3618-4941-9419-e89c1c5964d0	14	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
10dbaba0-aa45-48a2-8ef9-9e2dd49f3ee4	c663a8f9-3618-4941-9419-e89c1c5964d0	15	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
fa628bf9-4024-40d8-81ee-9f10a48193e8	c663a8f9-3618-4941-9419-e89c1c5964d0	16	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
ec1809a3-17ad-4f10-96c3-90350def9b1e	c663a8f9-3618-4941-9419-e89c1c5964d0	17	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
45043ce0-1b76-42e6-aeca-983c348fa1d3	c663a8f9-3618-4941-9419-e89c1c5964d0	18	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
c130c94e-60d9-4a00-ac03-43dfd2179cc3	c663a8f9-3618-4941-9419-e89c1c5964d0	19	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
cd82905e-3c36-40ad-8301-a0021f978b13	c663a8f9-3618-4941-9419-e89c1c5964d0	20	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
5bd1c277-628b-4210-9595-9eacea02db24	c663a8f9-3618-4941-9419-e89c1c5964d0	21	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d68d5d8b-0828-4fe4-806a-04f5246ae07d	c663a8f9-3618-4941-9419-e89c1c5964d0	22	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
187470aa-5bf7-4fd1-a94f-9c6f62076bc5	c663a8f9-3618-4941-9419-e89c1c5964d0	23	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
69aec23d-3f87-43e6-b41c-307e21a7ec53	c663a8f9-3618-4941-9419-e89c1c5964d0	24	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
1c0eb7fa-f283-4f78-8b1b-53e9360c7146	c663a8f9-3618-4941-9419-e89c1c5964d0	25	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
2d532522-b09f-436e-af38-0891cc9dadab	c663a8f9-3618-4941-9419-e89c1c5964d0	26	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
1dd48252-4091-4aca-91b3-c75228f8182f	c663a8f9-3618-4941-9419-e89c1c5964d0	27	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
e170ed74-9c66-42c8-a008-8b015b0f96fc	c663a8f9-3618-4941-9419-e89c1c5964d0	28	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
dc5cb7c6-abee-4004-a9be-496fecc1dd63	c663a8f9-3618-4941-9419-e89c1c5964d0	29	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
355f6eb1-7f22-49f4-baa1-cb3708df093a	c663a8f9-3618-4941-9419-e89c1c5964d0	30	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
eed85c30-7067-4db1-a19a-0ff2a0b1f976	c663a8f9-3618-4941-9419-e89c1c5964d0	31	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
a8a02a87-823d-4dcf-bf76-72284f69115d	c663a8f9-3618-4941-9419-e89c1c5964d0	32	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
48039cff-cfb0-4e35-8e92-b6173cc79fd1	c663a8f9-3618-4941-9419-e89c1c5964d0	33	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9596ad8f-cd8c-497c-a287-8370c436bbac	c663a8f9-3618-4941-9419-e89c1c5964d0	34	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
db5bdae5-490d-4e5f-a261-57c4b70e24f5	c663a8f9-3618-4941-9419-e89c1c5964d0	35	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
19656e5a-dced-42ad-b266-0bc006decefd	c663a8f9-3618-4941-9419-e89c1c5964d0	36	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
859216b1-7a32-4dde-afa0-926d43f58cff	c663a8f9-3618-4941-9419-e89c1c5964d0	37	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
5e5e2666-ae4f-42aa-b409-8caeb95201ff	c663a8f9-3618-4941-9419-e89c1c5964d0	38	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
f5d68a8e-9f2d-4d98-b9bb-7a90307a9c41	c663a8f9-3618-4941-9419-e89c1c5964d0	39	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
457cafe1-34c3-46f6-a3e8-af9026678d3f	c663a8f9-3618-4941-9419-e89c1c5964d0	40	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9d957550-de0b-4126-adfc-37081f8ff84f	c663a8f9-3618-4941-9419-e89c1c5964d0	41	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
90a67d3b-0f69-4b35-bd0a-1248ea5ec84f	c663a8f9-3618-4941-9419-e89c1c5964d0	42	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
6109ea19-63aa-4c30-ae8a-d50e59cec2bd	c663a8f9-3618-4941-9419-e89c1c5964d0	43	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7ed4be55-acc7-4ec1-9dc2-d2494da0bb94	c663a8f9-3618-4941-9419-e89c1c5964d0	44	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
2ca2d6b6-eca7-453f-9739-8b58433cfc58	c663a8f9-3618-4941-9419-e89c1c5964d0	45	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
2a7f0388-3282-4b36-b098-6fae80b3e752	c663a8f9-3618-4941-9419-e89c1c5964d0	46	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
0ff0133b-93b3-4408-af80-b45d443264b6	c663a8f9-3618-4941-9419-e89c1c5964d0	47	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
4b4db6e5-f70d-4d2c-9fd0-fcb63bbb4feb	c663a8f9-3618-4941-9419-e89c1c5964d0	48	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7c73aacb-8a95-4e8c-9866-4070f94583c5	c663a8f9-3618-4941-9419-e89c1c5964d0	49	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
36c70617-e4c9-4bd1-97fa-5d2480253eaa	c663a8f9-3618-4941-9419-e89c1c5964d0	50	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
fcdc5c88-36fa-4223-b7c6-af887afabf73	c663a8f9-3618-4941-9419-e89c1c5964d0	51	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
a094621e-9fcd-4cb4-b2cb-f833979a30b1	c663a8f9-3618-4941-9419-e89c1c5964d0	52	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
8a795a60-5411-496d-840d-6d1c83aecfc0	c663a8f9-3618-4941-9419-e89c1c5964d0	53	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
c400e922-6593-49f4-bc56-bcccb8af306a	c663a8f9-3618-4941-9419-e89c1c5964d0	54	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9c3b7ec9-45a9-4686-a69c-1d2c38b86883	c663a8f9-3618-4941-9419-e89c1c5964d0	55	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
3a8096e5-0f02-43f0-9784-990f64dc4017	c663a8f9-3618-4941-9419-e89c1c5964d0	56	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
b8ff42aa-efa7-4497-a9e2-ce8fee6db04f	c663a8f9-3618-4941-9419-e89c1c5964d0	57	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
cece904e-a6af-4a93-886c-d9763ef71dab	c663a8f9-3618-4941-9419-e89c1c5964d0	58	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
45ca280f-e583-4629-bc19-4b116337ac1e	c663a8f9-3618-4941-9419-e89c1c5964d0	59	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
a92dd0f7-4b4c-41ba-b1c5-41190e00b14f	c663a8f9-3618-4941-9419-e89c1c5964d0	60	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
e95c8cb7-1f78-4a3c-951a-d5c4ba101696	c663a8f9-3618-4941-9419-e89c1c5964d0	61	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
cf73b78c-235b-4dd6-919a-a5361b860870	c663a8f9-3618-4941-9419-e89c1c5964d0	62	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7ddedab7-10ca-4ae2-b2b2-34d9facb6c69	c663a8f9-3618-4941-9419-e89c1c5964d0	63	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
45c08ed5-09b4-4786-a478-892aab5e94ef	c663a8f9-3618-4941-9419-e89c1c5964d0	64	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
11bec10c-8434-4d56-a730-ab22a763e319	c663a8f9-3618-4941-9419-e89c1c5964d0	65	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
bb8a1634-1b57-4219-b0ea-afa3adf0742a	c663a8f9-3618-4941-9419-e89c1c5964d0	66	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
9316a7c1-4274-4ec3-a5da-0f64684f2fd6	c663a8f9-3618-4941-9419-e89c1c5964d0	67	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
1fa666cf-b39b-4ae7-99c6-40cec5ad8c1a	c663a8f9-3618-4941-9419-e89c1c5964d0	68	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
cb46fe86-395d-4671-8b8e-1c5d4d2ef461	c663a8f9-3618-4941-9419-e89c1c5964d0	69	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
037c198e-68b7-4a0a-ac5e-6e4001fa0432	c663a8f9-3618-4941-9419-e89c1c5964d0	70	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7f022f2a-650d-46b2-ad24-3a8ae161d66f	c663a8f9-3618-4941-9419-e89c1c5964d0	71	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
1c0bc38f-1e1e-4f8e-bb5e-1851073390bb	c663a8f9-3618-4941-9419-e89c1c5964d0	72	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
362e0a06-9384-4d1e-81c8-b7b6a56b589d	c663a8f9-3618-4941-9419-e89c1c5964d0	73	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
070696f7-e0b8-4a84-b183-a09d9c736d30	c663a8f9-3618-4941-9419-e89c1c5964d0	74	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
7d5cce86-81f4-4a35-9320-0cbee49dacf5	c663a8f9-3618-4941-9419-e89c1c5964d0	75	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
34dc9016-6c05-4de8-bd82-ef98a5124aff	c663a8f9-3618-4941-9419-e89c1c5964d0	76	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d48b777a-79d3-456d-8a52-7058d1cbb037	c663a8f9-3618-4941-9419-e89c1c5964d0	77	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
72ec0b98-bcdf-4a5b-8219-bd36bc8dad5a	c663a8f9-3618-4941-9419-e89c1c5964d0	78	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
93d7fd9a-6d11-4f16-9c70-b4251598f9e6	c663a8f9-3618-4941-9419-e89c1c5964d0	79	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
5d954c3a-6eae-4307-95ec-fb0287f7b93f	c663a8f9-3618-4941-9419-e89c1c5964d0	80	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
14bd507e-b61a-4b92-ae32-38e8821f6550	c663a8f9-3618-4941-9419-e89c1c5964d0	81	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
bd493a2e-2945-48ff-97e2-30c3f377da4f	c663a8f9-3618-4941-9419-e89c1c5964d0	82	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
0fe26ad9-8ef1-4b91-a12c-eb349c8ffbdc	c663a8f9-3618-4941-9419-e89c1c5964d0	83	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
6e0a5cec-e764-4bbd-a18a-6f5d647a9417	c663a8f9-3618-4941-9419-e89c1c5964d0	84	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
bcb6420c-7fde-4e87-83cb-c365a0b59ee8	c663a8f9-3618-4941-9419-e89c1c5964d0	85	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
8a6048e1-fb7a-471a-971d-c16537a6d347	c663a8f9-3618-4941-9419-e89c1c5964d0	86	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d76a6650-4586-4f01-9824-cf7cd426e832	c663a8f9-3618-4941-9419-e89c1c5964d0	87	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
2c6a590f-f478-4480-89f4-ea87685db976	c663a8f9-3618-4941-9419-e89c1c5964d0	88	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
e8852253-aeae-4369-a86e-7df7398b495f	c663a8f9-3618-4941-9419-e89c1c5964d0	89	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
69bec0ae-da5f-4fe1-8482-255b415e18c0	c663a8f9-3618-4941-9419-e89c1c5964d0	90	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
88582ebd-581c-4189-ad7c-88618d62051e	c663a8f9-3618-4941-9419-e89c1c5964d0	91	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
3b4d3d4d-9a8d-46ed-8573-a9f3874db0b2	c663a8f9-3618-4941-9419-e89c1c5964d0	92	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
347458e5-6999-4837-a81f-a76bebee2d0f	c663a8f9-3618-4941-9419-e89c1c5964d0	93	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d8f871fb-7178-4155-a99a-e74568915c63	c663a8f9-3618-4941-9419-e89c1c5964d0	94	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
fe4b65cf-709a-4af5-ab52-8bbd5fc20754	c663a8f9-3618-4941-9419-e89c1c5964d0	95	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
61b434a1-a64b-4d74-9f02-0371b67891ed	c663a8f9-3618-4941-9419-e89c1c5964d0	96	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
ec76ec5c-05e8-4ff4-b03e-aa8db79efe71	c663a8f9-3618-4941-9419-e89c1c5964d0	97	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
33577a38-5fe1-465f-a28b-1d3060a58ae0	c663a8f9-3618-4941-9419-e89c1c5964d0	98	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
4a2d3980-fc32-4929-bca4-3cf013a53216	c663a8f9-3618-4941-9419-e89c1c5964d0	99	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
d508a48b-2408-4b99-a81d-977baddfe099	c663a8f9-3618-4941-9419-e89c1c5964d0	100	SUBSCRIPTION	19126f07-feba-4912-a07c-959437184e63	2026-04-19 07:17:34.197	2028-04-08 07:17:34.118	\N	19126f07-feba-4912-a07c-959437184e63
\.


--
-- Data for Name: user_specifications; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.user_specifications (id, name, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_suggestions; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.user_suggestions (id, text, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.users (id, email, name, "accountNumber", password, is_verified, is_banned, ban_reason, rating, reviews_count, role_id, created_at, updated_at) FROM stdin;
f21081f3-1848-4c45-93fc-fa9de503b806	support@iqmonex.ru	IVAN	00000000	$argon2id$v=19$m=65536,t=3,p=1$BMJnzWHOiCm6qU73gpswDA$Ko1i59Ijn842IxW7BEtlOu9Mvbq/ptyg7+hCE/Rg4UE	f	f	\N	0	0	386b8bce-0b93-4d02-a1fe-8036fbc62d3d	2026-04-17 00:08:07.567	2026-04-17 00:08:07.567
c663a8f9-3618-4941-9419-e89c1c5964d0	ibadtoff@gmail.com	фыва	54948470	$argon2id$v=19$m=65536,t=3,p=1$RReTiQCBczn8YHqR2v9ZEg$N/GsGU6bhNh265EW5wCGqlYPyMHaTtXvfH9u5a94MSk	t	f	\N	0	0	e02982a3-8b93-4e98-8658-307ec132af10	2026-04-19 07:17:33.937	2026-04-19 07:23:08.716
\.


--
-- Data for Name: users_chats; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.users_chats (id, user_id, chats_id) FROM stdin;
\.


--
-- Data for Name: workers; Type: TABLE DATA; Schema: public; Owner: iqmonex_user
--

COPY public.workers (id, name, phone, email, is_active, role_id, user_id, created_at, updated_at) FROM stdin;
242a2581-ba1c-4659-a4ba-7ecd56bd676c	asdf	+79090909090	testing@gmail.com	t	9d5a91de-2cb2-4f06-b147-e7212a22678b	c663a8f9-3618-4941-9419-e89c1c5964d0	2026-04-19 07:20:35.502	2026-04-19 07:20:35.502
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.activities_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.categories_id_seq', 745, true);


--
-- Name: category_specifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.category_specifications_id_seq', 1, false);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.currencies_id_seq', 6, true);


--
-- Name: currency_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.currency_rates_id_seq', 13, true);


--
-- Name: legal_entity_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.legal_entity_types_id_seq', 15, true);


--
-- Name: specifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.specifications_id_seq', 13, true);


--
-- Name: unit_measurements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.unit_measurements_id_seq', 56, true);


--
-- Name: user_specifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.user_specifications_id_seq', 1, false);


--
-- Name: user_suggestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: iqmonex_user
--

SELECT pg_catalog.setval('public.user_suggestions_id_seq', 1, false);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_specifications category_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_pkey PRIMARY KEY (id);


--
-- Name: chat_files chat_files_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_pkey PRIMARY KEY (id);


--
-- Name: chat_participants chat_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: currency_rates currency_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.currency_rates
    ADD CONSTRAINT currency_rates_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: legal_entity_types legal_entity_types_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.legal_entity_types
    ADD CONSTRAINT legal_entity_types_pkey PRIMARY KEY (id);


--
-- Name: listing_likes listing_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_pkey PRIMARY KEY (id);


--
-- Name: listing_slots listing_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_pkey PRIMARY KEY (id);


--
-- Name: listing_specifications listing_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_specifications
    ADD CONSTRAINT listing_specifications_pkey PRIMARY KEY (id);


--
-- Name: listing_user_specifications listing_user_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_user_specifications
    ADD CONSTRAINT listing_user_specifications_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: map_locations map_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.map_locations
    ADD CONSTRAINT map_locations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: payment_items payment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.payment_items
    ADD CONSTRAINT payment_items_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: pinned_chats pinned_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: promo_campaign_participants promo_campaign_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.promo_campaign_participants
    ADD CONSTRAINT promo_campaign_participants_pkey PRIMARY KEY (id);


--
-- Name: promo_campaigns promo_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.promo_campaigns
    ADD CONSTRAINT promo_campaigns_pkey PRIMARY KEY (id);


--
-- Name: review_files review_files_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.review_files
    ADD CONSTRAINT review_files_pkey PRIMARY KEY (id);


--
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: slot_packages slot_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.slot_packages
    ADD CONSTRAINT slot_packages_pkey PRIMARY KEY (id);


--
-- Name: specifications specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.specifications
    ADD CONSTRAINT specifications_pkey PRIMARY KEY (id);


--
-- Name: subscription_periods subscription_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.subscription_periods
    ADD CONSTRAINT subscription_periods_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tariffs tariffs_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_pkey PRIMARY KEY (id);


--
-- Name: unit_measurements unit_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.unit_measurements
    ADD CONSTRAINT unit_measurements_pkey PRIMARY KEY (id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: user_notes user_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_pkey PRIMARY KEY (id);


--
-- Name: user_slots user_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT user_slots_pkey PRIMARY KEY (id);


--
-- Name: user_specifications user_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_specifications
    ADD CONSTRAINT user_specifications_pkey PRIMARY KEY (id);


--
-- Name: user_suggestions user_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_suggestions
    ADD CONSTRAINT user_suggestions_pkey PRIMARY KEY (id);


--
-- Name: users_chats users_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workers workers_pkey; Type: CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_pkey PRIMARY KEY (id);


--
-- Name: activities_name_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX activities_name_key ON public.activities USING btree (name);


--
-- Name: categories_name_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX categories_name_idx ON public.categories USING btree (name);


--
-- Name: categories_parentId_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX "categories_parentId_idx" ON public.categories USING btree ("parentId");


--
-- Name: categories_parentId_name_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX "categories_parentId_name_idx" ON public.categories USING btree ("parentId", name);


--
-- Name: category_specifications_category_id_specification_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX category_specifications_category_id_specification_id_key ON public.category_specifications USING btree (category_id, specification_id);


--
-- Name: chat_participants_user_id_chat_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX chat_participants_user_id_chat_id_key ON public.chat_participants USING btree (user_id, chat_id);


--
-- Name: complaints_author_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX complaints_author_id_idx ON public.complaints USING btree (author_id);


--
-- Name: complaints_complaintType_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX "complaints_complaintType_listing_id_idx" ON public.complaints USING btree ("complaintType", listing_id);


--
-- Name: complaints_complaintType_target_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX "complaints_complaintType_target_user_id_idx" ON public.complaints USING btree ("complaintType", target_user_id);


--
-- Name: currencies_code_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX currencies_code_key ON public.currencies USING btree (code);


--
-- Name: currency_rates_code_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX currency_rates_code_key ON public.currency_rates USING btree (code);


--
-- Name: donations_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX donations_user_id_idx ON public.donations USING btree (user_id);


--
-- Name: favorites_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX favorites_listing_id_idx ON public.favorites USING btree (listing_id);


--
-- Name: favorites_target_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX favorites_target_user_id_idx ON public.favorites USING btree (target_user_id);


--
-- Name: favorites_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX favorites_user_id_idx ON public.favorites USING btree (user_id);


--
-- Name: favorites_user_id_type_listing_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX favorites_user_id_type_listing_id_key ON public.favorites USING btree (user_id, type, listing_id);


--
-- Name: favorites_user_id_type_target_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX favorites_user_id_type_target_user_id_key ON public.favorites USING btree (user_id, type, target_user_id);


--
-- Name: files_complaint_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_complaint_id_idx ON public.files USING btree (complaint_id);


--
-- Name: files_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_listing_id_idx ON public.files USING btree (listing_id);


--
-- Name: files_listing_id_kind_sort_order_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_listing_id_kind_sort_order_idx ON public.files USING btree (listing_id, kind, sort_order);


--
-- Name: files_owner_type_complaint_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_complaint_id_idx ON public.files USING btree (owner_type, complaint_id);


--
-- Name: files_owner_type_complaint_id_kind_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_complaint_id_kind_idx ON public.files USING btree (owner_type, complaint_id, kind);


--
-- Name: files_owner_type_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_listing_id_idx ON public.files USING btree (owner_type, listing_id);


--
-- Name: files_owner_type_listing_id_kind_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_listing_id_kind_idx ON public.files USING btree (owner_type, listing_id, kind);


--
-- Name: files_owner_type_suggestion_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_suggestion_id_idx ON public.files USING btree (owner_type, suggestion_id);


--
-- Name: files_owner_type_suggestion_id_kind_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_suggestion_id_kind_idx ON public.files USING btree (owner_type, suggestion_id, kind);


--
-- Name: files_owner_type_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_user_id_idx ON public.files USING btree (owner_type, user_id);


--
-- Name: files_owner_type_user_id_kind_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_user_id_kind_idx ON public.files USING btree (owner_type, user_id, kind);


--
-- Name: files_owner_type_worker_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_worker_id_idx ON public.files USING btree (owner_type, worker_id);


--
-- Name: files_owner_type_worker_id_kind_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_owner_type_worker_id_kind_idx ON public.files USING btree (owner_type, worker_id, kind);


--
-- Name: files_suggestion_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_suggestion_id_idx ON public.files USING btree (suggestion_id);


--
-- Name: files_upload_status_expires_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_upload_status_expires_at_idx ON public.files USING btree (upload_status, expires_at);


--
-- Name: files_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_user_id_idx ON public.files USING btree (user_id);


--
-- Name: files_worker_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX files_worker_id_idx ON public.files USING btree (worker_id);


--
-- Name: listing_likes_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listing_likes_listing_id_idx ON public.listing_likes USING btree (listing_id);


--
-- Name: listing_likes_listing_id_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listing_likes_listing_id_user_id_key ON public.listing_likes USING btree (listing_id, user_id);


--
-- Name: listing_likes_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listing_likes_user_id_idx ON public.listing_likes USING btree (user_id);


--
-- Name: listing_slots_listing_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listing_slots_listing_id_key ON public.listing_slots USING btree (listing_id);


--
-- Name: listing_slots_user_slot_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listing_slots_user_slot_id_key ON public.listing_slots USING btree (user_slot_id);


--
-- Name: listing_slots_user_slot_id_released_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listing_slots_user_slot_id_released_at_idx ON public.listing_slots USING btree (user_slot_id, released_at);


--
-- Name: listing_specifications_listing_id_specification_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listing_specifications_listing_id_specification_id_key ON public.listing_specifications USING btree (listing_id, specification_id);


--
-- Name: listing_user_specifications_listing_id_user_specification_i_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listing_user_specifications_listing_id_user_specification_i_key ON public.listing_user_specifications USING btree (listing_id, user_specification_id);


--
-- Name: listings_account_number_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX listings_account_number_key ON public.listings USING btree (account_number);


--
-- Name: listings_condition_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_condition_status_idx ON public.listings USING btree (condition, status);


--
-- Name: listings_created_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_created_at_idx ON public.listings USING btree (created_at);


--
-- Name: listings_price_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_price_status_idx ON public.listings USING btree (price, status);


--
-- Name: listings_status_auto_delete_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_status_auto_delete_at_idx ON public.listings USING btree (status, auto_delete_at);


--
-- Name: listings_status_condition_subcategory_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_status_condition_subcategory_id_idx ON public.listings USING btree (status, condition, subcategory_id);


--
-- Name: listings_status_created_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_status_created_at_idx ON public.listings USING btree (status, created_at);


--
-- Name: listings_status_last_used_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_status_last_used_at_idx ON public.listings USING btree (status, last_used_at);


--
-- Name: listings_subcategory_id_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_subcategory_id_status_idx ON public.listings USING btree (subcategory_id, status);


--
-- Name: listings_subcategory_id_status_published_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_subcategory_id_status_published_at_idx ON public.listings USING btree (subcategory_id, status, published_at);


--
-- Name: listings_user_id_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX listings_user_id_status_idx ON public.listings USING btree (user_id, status);


--
-- Name: map_locations_geo_hash_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX map_locations_geo_hash_idx ON public.map_locations USING btree (geo_hash);


--
-- Name: map_locations_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX map_locations_latitude_longitude_idx ON public.map_locations USING btree (latitude, longitude);


--
-- Name: map_locations_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX map_locations_listing_id_idx ON public.map_locations USING btree (listing_id);


--
-- Name: map_locations_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX map_locations_user_id_idx ON public.map_locations USING btree (user_id);


--
-- Name: messages_chat_id_created_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX messages_chat_id_created_at_idx ON public.messages USING btree (chat_id, created_at);


--
-- Name: payment_items_item_type_itemId_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX "payment_items_item_type_itemId_idx" ON public.payment_items USING btree (item_type, "itemId");


--
-- Name: payment_items_payment_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX payment_items_payment_id_idx ON public.payment_items USING btree (payment_id);


--
-- Name: payments_external_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX payments_external_id_idx ON public.payments USING btree (external_id);


--
-- Name: payments_status_created_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX payments_status_created_at_idx ON public.payments USING btree (status, created_at);


--
-- Name: payments_user_id_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX payments_user_id_status_idx ON public.payments USING btree (user_id, status);


--
-- Name: profiles_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);


--
-- Name: promo_campaign_participants_campaign_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX promo_campaign_participants_campaign_id_idx ON public.promo_campaign_participants USING btree (campaign_id);


--
-- Name: promo_campaign_participants_campaign_id_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX promo_campaign_participants_campaign_id_user_id_key ON public.promo_campaign_participants USING btree (campaign_id, user_id);


--
-- Name: promo_campaign_participants_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX promo_campaign_participants_user_id_idx ON public.promo_campaign_participants USING btree (user_id);


--
-- Name: promo_campaigns_code_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX promo_campaigns_code_key ON public.promo_campaigns USING btree (code);


--
-- Name: promo_campaigns_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX promo_campaigns_status_idx ON public.promo_campaigns USING btree (status);


--
-- Name: review_files_review_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX review_files_review_id_idx ON public.review_files USING btree (review_id);


--
-- Name: review_likes_review_id_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX review_likes_review_id_user_id_key ON public.review_likes USING btree (review_id, user_id);


--
-- Name: reviews_author_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX reviews_author_id_idx ON public.reviews USING btree (author_id);


--
-- Name: reviews_listing_id_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX reviews_listing_id_status_idx ON public.reviews USING btree (listing_id, status);


--
-- Name: reviews_target_user_id_status_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX reviews_target_user_id_status_idx ON public.reviews USING btree (target_user_id, status);


--
-- Name: roles_role_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX roles_role_key ON public.roles USING btree (role);


--
-- Name: roles_type_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX roles_type_idx ON public.roles USING btree (type);


--
-- Name: slot_packages_user_id_is_active_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX slot_packages_user_id_is_active_idx ON public.slot_packages USING btree (user_id, is_active);


--
-- Name: subscription_periods_subscription_id_end_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX subscription_periods_subscription_id_end_at_idx ON public.subscription_periods USING btree (subscription_id, end_at);


--
-- Name: subscriptions_user_id_is_active_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX subscriptions_user_id_is_active_idx ON public.subscriptions USING btree (user_id, is_active);


--
-- Name: user_activities_user_id_activity_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX user_activities_user_id_activity_id_key ON public.user_activities USING btree (user_id, activity_id);


--
-- Name: user_notes_author_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX user_notes_author_id_idx ON public.user_notes USING btree (author_id);


--
-- Name: user_notes_author_id_target_type_target_listing_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX user_notes_author_id_target_type_target_listing_id_key ON public.user_notes USING btree (author_id, target_type, target_listing_id);


--
-- Name: user_notes_author_id_target_type_target_user_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX user_notes_author_id_target_type_target_user_id_key ON public.user_notes USING btree (author_id, target_type, target_user_id);


--
-- Name: user_notes_target_listing_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX user_notes_target_listing_id_idx ON public.user_notes USING btree (target_listing_id);


--
-- Name: user_notes_target_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX user_notes_target_user_id_idx ON public.user_notes USING btree (target_user_id);


--
-- Name: user_slots_source_type_source_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX user_slots_source_type_source_id_idx ON public.user_slots USING btree (source_type, source_id);


--
-- Name: user_slots_user_id_expires_at_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX user_slots_user_id_expires_at_idx ON public.user_slots USING btree (user_id, expires_at);


--
-- Name: user_slots_user_id_slot_index_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX user_slots_user_id_slot_index_key ON public.user_slots USING btree (user_id, slot_index);


--
-- Name: users_accountNumber_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX "users_accountNumber_key" ON public.users USING btree ("accountNumber");


--
-- Name: users_chats_index_0; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX users_chats_index_0 ON public.users_chats USING btree (user_id, chats_id);


--
-- Name: users_chats_user_id_chats_id_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX users_chats_user_id_chats_id_key ON public.users_chats USING btree (user_id, chats_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: workers_role_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX workers_role_id_idx ON public.workers USING btree (role_id);


--
-- Name: workers_user_id_idx; Type: INDEX; Schema: public; Owner: iqmonex_user
--

CREATE INDEX workers_user_id_idx ON public.workers USING btree (user_id);


--
-- Name: categories categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: category_specifications category_specifications_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: category_specifications category_specifications_specification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_specification_id_fkey FOREIGN KEY (specification_id) REFERENCES public.specifications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chat_files chat_files_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: chat_files chat_files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chat_participants chat_participants_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: chat_participants chat_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: complaints complaints_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: complaints complaints_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: complaints complaints_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: donations donations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_complaint_fk; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_complaint_fk FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_listing_fk; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_listing_fk FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_suggestion_fk; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_suggestion_fk FOREIGN KEY (suggestion_id) REFERENCES public.user_suggestions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_worker_fk; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_worker_fk FOREIGN KEY (worker_id) REFERENCES public.workers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_likes listing_likes_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_likes listing_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_slots listing_slots_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_slots listing_slots_user_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_user_slot_id_fkey FOREIGN KEY (user_slot_id) REFERENCES public.user_slots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_specifications listing_specifications_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_specifications
    ADD CONSTRAINT listing_specifications_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_specifications listing_specifications_specification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_specifications
    ADD CONSTRAINT listing_specifications_specification_id_fkey FOREIGN KEY (specification_id) REFERENCES public.specifications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: listing_user_specifications listing_user_specifications_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_user_specifications
    ADD CONSTRAINT listing_user_specifications_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_user_specifications listing_user_specifications_user_specification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listing_user_specifications
    ADD CONSTRAINT listing_user_specifications_user_specification_id_fkey FOREIGN KEY (user_specification_id) REFERENCES public.user_specifications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: listings listings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_price_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_price_unit_id_fkey FOREIGN KEY (price_unit_id) REFERENCES public.unit_measurements(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_subsubcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_subsubcategory_id_fkey FOREIGN KEY (subsubcategory_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_locations map_locations_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.map_locations
    ADD CONSTRAINT map_locations_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_locations map_locations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.map_locations
    ADD CONSTRAINT map_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: payment_items payment_items_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.payment_items
    ADD CONSTRAINT payment_items_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pinned_chats pinned_chats_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: pinned_chats pinned_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: profiles profiles_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: profiles profiles_legal_entity_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_legal_entity_type_id_fkey FOREIGN KEY (legal_entity_type_id) REFERENCES public.legal_entity_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promo_campaign_participants promo_campaign_participants_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.promo_campaign_participants
    ADD CONSTRAINT promo_campaign_participants_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.promo_campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promo_campaign_participants promo_campaign_participants_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.promo_campaign_participants
    ADD CONSTRAINT promo_campaign_participants_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promo_campaign_participants promo_campaign_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.promo_campaign_participants
    ADD CONSTRAINT promo_campaign_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_files review_files_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.review_files
    ADD CONSTRAINT review_files_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: slot_packages slot_packages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.slot_packages
    ADD CONSTRAINT slot_packages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscription_periods subscription_periods_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.subscription_periods
    ADD CONSTRAINT subscription_periods_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_tariff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_tariff_id_fkey FOREIGN KEY (tariff_id) REFERENCES public.tariffs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_activities user_activities_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_notes user_notes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_notes
    ADD CONSTRAINT user_notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_slots user_slots_slotPackageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT "user_slots_slotPackageId_fkey" FOREIGN KEY ("slotPackageId") REFERENCES public.slot_packages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_slots user_slots_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT "user_slots_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_slots user_slots_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT user_slots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_specifications user_specifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.user_specifications
    ADD CONSTRAINT user_specifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_chats users_chats_chats_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_chats_id_fkey FOREIGN KEY (chats_id) REFERENCES public.chats(id);


--
-- Name: users_chats users_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workers workers_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workers workers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: iqmonex_user
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: iqmonex_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict SxnpvEk13DSLlqE0qgxSi3FuZ6JIbBdWF96hUzEFNerc3ykOyJD2LOGMhIEmthx

