--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ComplaintType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintType" AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public."ComplaintType" OWNER TO postgres;

--
-- Name: DonationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DonationStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELED'
);


ALTER TYPE public."DonationStatus" OWNER TO postgres;

--
-- Name: FavoriteType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FavoriteType" AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public."FavoriteType" OWNER TO postgres;

--
-- Name: file_kind; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.file_kind AS ENUM (
    'AVATAR',
    'PHOTO',
    'DOCUMENT',
    'COMPLAINT_PHOTO'
);


ALTER TYPE public.file_kind OWNER TO postgres;

--
-- Name: file_owner_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.file_owner_type AS ENUM (
    'USER',
    'LISTING',
    'COMPLAINT'
);


ALTER TYPE public.file_owner_type OWNER TO postgres;

--
-- Name: listing_condition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.listing_condition AS ENUM (
    'NEW',
    'USED'
);


ALTER TYPE public.listing_condition OWNER TO postgres;

--
-- Name: listing_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.listing_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED',
    'TEMPLATE'
);


ALTER TYPE public.listing_status OWNER TO postgres;

--
-- Name: map_location_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.map_location_type AS ENUM (
    'OFFICE',
    'WAREHOUSE',
    'OTHER'
);


ALTER TYPE public.map_location_type OWNER TO postgres;

--
-- Name: payment_item_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_item_type AS ENUM (
    'SUBSCRIPTION',
    'SLOT_PACKAGE',
    'DONATION'
);


ALTER TYPE public.payment_item_type OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- Name: review_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.review_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.review_status OWNER TO postgres;

--
-- Name: review_target_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.review_target_type AS ENUM (
    'LISTING',
    'USER'
);


ALTER TYPE public.review_target_type OWNER TO postgres;

--
-- Name: role_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_types AS ENUM (
    'WORKER',
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public.role_types OWNER TO postgres;

--
-- Name: slot_cource; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.slot_cource AS ENUM (
    'SUBSCRIPTION',
    'SLOT_PACKAGE'
);


ALTER TYPE public.slot_cource OWNER TO postgres;

--
-- Name: tariff_code; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tariff_code AS ENUM (
    'BASE',
    'MAIN',
    'PREMIUM'
);


ALTER TYPE public.tariff_code OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    "parentId" integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_specifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_specifications (
    id integer NOT NULL,
    category_id integer NOT NULL,
    specification_id integer NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    default_unit_id integer
);


ALTER TABLE public.category_specifications OWNER TO postgres;

--
-- Name: category_specifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_specifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_specifications_id_seq OWNER TO postgres;

--
-- Name: category_specifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_specifications_id_seq OWNED BY public.category_specifications.id;


--
-- Name: chat_files; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.chat_files OWNER TO postgres;

--
-- Name: chat_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_participants (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.chat_participants OWNER TO postgres;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: complaints; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.complaints OWNER TO postgres;

--
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currencies (
    id integer NOT NULL,
    symbol text NOT NULL,
    code text NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.currencies_id_seq OWNER TO postgres;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


--
-- Name: currency_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_rates (
    id integer NOT NULL,
    code character varying(3) NOT NULL,
    nominal integer NOT NULL,
    rate numeric(10,4) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.currency_rates OWNER TO postgres;

--
-- Name: currency_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currency_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.currency_rates_id_seq OWNER TO postgres;

--
-- Name: currency_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.currency_rates_id_seq OWNED BY public.currency_rates.id;


--
-- Name: donations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.donations OWNER TO postgres;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    type public."FavoriteType" NOT NULL,
    listing_id uuid,
    target_user_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
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
    complaint_id uuid
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: listing_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing_likes (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.listing_likes OWNER TO postgres;

--
-- Name: listing_slots; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.listing_slots OWNER TO postgres;

--
-- Name: listing_specifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing_specifications (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    specification_id integer NOT NULL,
    value text NOT NULL,
    unit_id integer,
    is_required boolean DEFAULT true NOT NULL
);


ALTER TABLE public.listing_specifications OWNER TO postgres;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    subcategory_id integer NOT NULL,
    rating double precision DEFAULT 0,
    reviews_count integer DEFAULT 0 NOT NULL,
    title character varying(255),
    description character varying(3000),
    status public.listing_status DEFAULT 'DRAFT'::public.listing_status NOT NULL,
    price numeric(15,2),
    currency_id integer,
    price_unit_id integer,
    condition public.listing_condition,
    views_count integer DEFAULT 0 NOT NULL,
    favorites_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    published_at timestamp(3) without time zone,
    archived_at timestamp(3) without time zone,
    auto_delete_at timestamp(3) without time zone,
    last_used_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- Name: map_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_locations (
    id uuid NOT NULL,
    listing_id uuid NOT NULL,
    type public.map_location_type NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longtitude numeric(11,8) NOT NULL,
    geo_hash text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.map_locations OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: payment_items; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.payment_items OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: pinned_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pinned_chats (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    pinned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pinned_chats OWNER TO postgres;

--
-- Name: review_files; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.review_files OWNER TO postgres;

--
-- Name: review_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_likes (
    id uuid NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.review_likes OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    author_id uuid NOT NULL,
    target_type public.review_target_type NOT NULL,
    listing_id uuid,
    target_user_id uuid,
    rating integer NOT NULL,
    title character varying(255),
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


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    role text NOT NULL,
    code text NOT NULL,
    type public.role_types NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: slot_packages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.slot_packages OWNER TO postgres;

--
-- Name: specifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specifications (
    id integer NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.specifications OWNER TO postgres;

--
-- Name: specifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.specifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.specifications_id_seq OWNER TO postgres;

--
-- Name: specifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.specifications_id_seq OWNED BY public.specifications.id;


--
-- Name: subscription_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_periods (
    id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    days integer NOT NULL,
    start_at timestamp(3) without time zone NOT NULL,
    end_at timestamp(3) without time zone NOT NULL,
    payment_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.subscription_periods OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: tariffs; Type: TABLE; Schema: public; Owner: postgres
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
    price numeric(12,2) NOT NULL,
    currency_code text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tariffs OWNER TO postgres;

--
-- Name: unit_measurements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_measurements (
    id integer NOT NULL,
    name jsonb NOT NULL
);


ALTER TABLE public.unit_measurements OWNER TO postgres;

--
-- Name: unit_measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unit_measurements_id_seq OWNER TO postgres;

--
-- Name: unit_measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_measurements_id_seq OWNED BY public.unit_measurements.id;


--
-- Name: user_slots; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.user_slots OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "accountNumber" text NOT NULL,
    password text NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    rating double precision DEFAULT 0,
    reviews_count integer DEFAULT 0 NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_chats (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    chats_id uuid NOT NULL
);


ALTER TABLE public.users_chats OWNER TO postgres;

--
-- Name: workers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workers (
    id uuid NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    "isAcitve" boolean NOT NULL,
    role_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.workers OWNER TO postgres;

--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: category_specifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_specifications ALTER COLUMN id SET DEFAULT nextval('public.category_specifications_id_seq'::regclass);


--
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


--
-- Name: currency_rates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_rates ALTER COLUMN id SET DEFAULT nextval('public.currency_rates_id_seq'::regclass);


--
-- Name: specifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specifications ALTER COLUMN id SET DEFAULT nextval('public.specifications_id_seq'::regclass);


--
-- Name: unit_measurements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_measurements ALTER COLUMN id SET DEFAULT nextval('public.unit_measurements_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, "parentId") FROM stdin;
1	Готовая продукция	\N
101	Электроника и бытовая техника	1
1001	Смартфоны и планшеты	101
1002	Ноутбуки и компьютеры	101
1003	Комплектующие и аксессуары	101
1004	Телевизоры и аудиотехника	101
1005	Фото- и видеотехника	101
102	Одежда и обувь	1
1017	Верхняя одежда	102
1018	Обувь	102
1019	Нижнее бельё и домашняя одежда	102
2	Техника	\N
201	Бытовая техника	2
2001	Холодильники	201
2002	Стиральные машины	201
2003	Плиты и духовки	201
3	Готовый бизнес	\N
301	Готовый бизнес	3
3001	Интернет-магазины	301
3002	Производство	301
3003	Торговля	301
4	Сельское хозяйство	\N
401	Растениеводство	4
4001	Зерновые культуры	401
4002	Овощи	401
4003	Фрукты	401
5	Недвижимость	\N
501	Квартиры	5
5001	1-комнатные	501
5002	2-комнатные	501
5003	3-комнатные	501
5004	Студии	501
502	Дома	5
5005	Коттеджи	502
5006	Таунхаусы	502
5007	Дачи	502
6	Продукты питания	\N
601	Мясная продукция	6
6001	Колбасы и сосиски	601
6002	Мясо и полуфабрикаты	601
602	Молочные продукты	6
6003	Молоко	602
6004	Сыры	602
7	Сырье и промышленность	\N
701	Металлы	7
7001	Черные металлы	701
7002	Цветные металлы	701
8	Услуги	\N
801	IT услуги	8
8001	Разработка ПО	801
8002	Веб-разработка	801
802	Маркетинг	8
8003	SMM	802
8004	SEO	802
\.


--
-- Data for Name: category_specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_specifications (id, category_id, specification_id, is_required, default_unit_id) FROM stdin;
\.


--
-- Data for Name: chat_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_files (id, mime_type, upload_status, user_id, chat_id, expires_at, file_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: chat_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_participants (id, user_id, chat_id, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.complaints (id, "complaintType", type, text, author_id, listing_id, target_user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (id, symbol, code, name) FROM stdin;
1	₽	RUB	{"en": "Russian Ruble", "kz": "Ресей рублі", "ru": "Российский рубль"}
2	₸	KZT	{"en": "Kazakhstani Tenge", "kz": "Қазақстан теңгесі", "ru": "Казахстанский тенге"}
3	Br	BYN	{"en": "Belarusian Ruble", "kz": "Беларусь рублі", "ru": "Белорусский рубль"}
4	€	EUR	{"en": "Euro", "kz": "Еуро", "ru": "Евро"}
5	$	USD	{"en": "US Dollar", "kz": "АҚШ доллары", "ru": "Доллар США"}
6	¥	CNY	{"en": "Chinese Yuan", "kz": "Қытай юані", "ru": "Китайский юань"}
\.


--
-- Data for Name: currency_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_rates (id, code, nominal, rate, date) FROM stdin;
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donations (id, user_id, amount, currency, comment, status, payment_id, created_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, type, listing_id, target_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, owner_type, s3_key, s3_bucket, url, file_type, file_name, file_size, kind, is_primary, sort_order, upload_status, expires_at, created_at, updated_at, user_id, listing_id, complaint_id) FROM stdin;
9026b2f4-98e2-4618-a399-ec79c16014c2	LISTING	listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/documents/document_0.pdf	adverts	https://storage.clo.ru/adverts/listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/documents/document_0.pdf	application/pdf	file_0_1773829848064.pdf	17	DOCUMENT	f	0	completed	\N	2026-03-18 10:30:48.067	2026-03-18 10:30:49.632	\N	6b86c260-ef3d-4ad3-8f0e-443b0426914c	\N
15c7589d-6807-4ee9-b47d-d253eb342c49	LISTING	listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/documents/document_1.pdf	adverts	https://storage.clo.ru/adverts/listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/documents/document_1.pdf	text/plain	file_1_1773829848064.txt	11	DOCUMENT	f	1	completed	\N	2026-03-18 10:30:48.067	2026-03-18 10:30:49.789	\N	6b86c260-ef3d-4ad3-8f0e-443b0426914c	\N
7288d253-8e76-4019-9af2-ba3714175d30	LISTING	listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_0.jpg	adverts	https://storage.clo.ru/adverts/listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_0.jpg	image/jpeg	photo_0_1773829848078.jpg	18	PHOTO	f	0	completed	\N	2026-03-18 10:30:48.08	2026-03-18 10:30:49.92	\N	6b86c260-ef3d-4ad3-8f0e-443b0426914c	\N
6bf69a9c-ea0e-4d33-be20-0fa4f4c639e3	LISTING	listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_1.jpg	adverts	https://storage.clo.ru/adverts/listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_1.jpg	image/jpeg	photo_1_1773829848078.jpg	18	PHOTO	f	1	completed	\N	2026-03-18 10:30:48.08	2026-03-18 10:30:50.048	\N	6b86c260-ef3d-4ad3-8f0e-443b0426914c	\N
7e931a14-7b86-4f92-9260-dcc93db779e0	LISTING	listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_2.jpg	adverts	https://storage.clo.ru/adverts/listings/6b86c260-ef3d-4ad3-8f0e-443b0426914c/photos/photo_2.jpg	image/jpeg	photo_2_1773829848078.jpg	18	PHOTO	f	2	completed	\N	2026-03-18 10:30:48.08	2026-03-18 10:30:50.17	\N	6b86c260-ef3d-4ad3-8f0e-443b0426914c	\N
e10d9b7e-61db-4422-b3a1-b26602c70100	LISTING	listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/documents/document_0.pdf	adverts	https://storage.clo.ru/adverts/listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/documents/document_0.pdf	application/pdf	file_0_1773829852293.pdf	17	DOCUMENT	f	0	completed	\N	2026-03-18 10:30:52.294	2026-03-18 10:30:52.446	\N	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	\N
286ab704-9112-4fd9-a166-734aafded345	LISTING	listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/documents/document_1.pdf	adverts	https://storage.clo.ru/adverts/listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/documents/document_1.pdf	text/plain	file_1_1773829852293.txt	11	DOCUMENT	f	1	completed	\N	2026-03-18 10:30:52.294	2026-03-18 10:30:52.583	\N	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	\N
5181ae43-2dc6-4d5d-8e89-cfdf122fc6b4	LISTING	listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_0.jpg	adverts	https://storage.clo.ru/adverts/listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_0.jpg	image/jpeg	photo_0_1773829852298.jpg	18	PHOTO	f	0	completed	\N	2026-03-18 10:30:52.299	2026-03-18 10:30:52.767	\N	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	\N
49a09081-91d7-4a71-a5ac-cd9c8db026ca	LISTING	listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_1.jpg	adverts	https://storage.clo.ru/adverts/listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_1.jpg	image/jpeg	photo_1_1773829852298.jpg	18	PHOTO	f	1	completed	\N	2026-03-18 10:30:52.299	2026-03-18 10:30:52.886	\N	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	\N
bef78797-a63d-4a00-8b5b-7a7cccf882a5	LISTING	listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_2.jpg	adverts	https://storage.clo.ru/adverts/listings/ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c/photos/photo_2.jpg	image/jpeg	photo_2_1773829852298.jpg	18	PHOTO	f	2	completed	\N	2026-03-18 10:30:52.299	2026-03-18 10:30:53.018	\N	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	\N
a38ad790-432e-448e-ac9d-5373b0b7c1a9	LISTING	listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/documents/document_0.pdf	adverts	https://storage.clo.ru/adverts/listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/documents/document_0.pdf	application/pdf	file_0_1773829853245.pdf	17	DOCUMENT	f	0	completed	\N	2026-03-18 10:30:53.245	2026-03-18 10:30:53.372	\N	7e1cf2b2-9156-41e1-99fa-798e4aba9565	\N
03ea501a-37f8-42bb-b1f1-11817aacc38c	LISTING	listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/documents/document_1.pdf	adverts	https://storage.clo.ru/adverts/listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/documents/document_1.pdf	text/plain	file_1_1773829853245.txt	11	DOCUMENT	f	1	completed	\N	2026-03-18 10:30:53.245	2026-03-18 10:30:53.501	\N	7e1cf2b2-9156-41e1-99fa-798e4aba9565	\N
1b8f2599-ae50-42bb-ba4c-416a9a85f6d5	LISTING	listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_0.jpg	adverts	https://storage.clo.ru/adverts/listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_0.jpg	image/jpeg	photo_0_1773829853247.jpg	18	PHOTO	f	0	completed	\N	2026-03-18 10:30:53.247	2026-03-18 10:30:53.624	\N	7e1cf2b2-9156-41e1-99fa-798e4aba9565	\N
f7063d00-69ec-425e-9a1b-bc4ac2975499	LISTING	listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_1.jpg	adverts	https://storage.clo.ru/adverts/listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_1.jpg	image/jpeg	photo_1_1773829853247.jpg	18	PHOTO	f	1	completed	\N	2026-03-18 10:30:53.247	2026-03-18 10:30:53.743	\N	7e1cf2b2-9156-41e1-99fa-798e4aba9565	\N
4c0db871-3a31-4769-a00c-f4d4bd304b3c	LISTING	listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_2.jpg	adverts	https://storage.clo.ru/adverts/listings/7e1cf2b2-9156-41e1-99fa-798e4aba9565/photos/photo_2.jpg	image/jpeg	photo_2_1773829853247.jpg	18	PHOTO	f	2	completed	\N	2026-03-18 10:30:53.247	2026-03-18 10:30:53.862	\N	7e1cf2b2-9156-41e1-99fa-798e4aba9565	\N
\.


--
-- Data for Name: listing_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listing_likes (id, listing_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: listing_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listing_slots (id, listing_id, user_slot_id, assigned_at, released_at, release_reason, created_at, updated_at) FROM stdin;
e579a96e-2859-4979-8fe7-665c891426fe	6b86c260-ef3d-4ad3-8f0e-443b0426914c	14f00031-3fa8-4172-9cc1-ac93cae9df67	2026-03-18 10:30:48.06	\N	\N	2026-03-18 10:30:48.061	2026-03-18 10:30:48.061
5cc0b766-6013-41f0-8665-3f96ab31b64c	ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	c895b8ca-e414-4194-b7ed-1f6efdaa0aea	2026-03-18 10:30:52.29	\N	\N	2026-03-18 10:30:52.29	2026-03-18 10:30:52.29
3c8d6f1d-3490-478a-856d-0875fd0200b0	7e1cf2b2-9156-41e1-99fa-798e4aba9565	d2efe148-c6fa-4d62-9fe6-bb9e8594eb0d	2026-03-18 10:30:53.244	\N	\N	2026-03-18 10:30:53.244	2026-03-18 10:30:53.244
\.


--
-- Data for Name: listing_specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listing_specifications (id, listing_id, specification_id, value, unit_id, is_required) FROM stdin;
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, user_id, subcategory_id, rating, reviews_count, title, description, status, price, currency_id, price_unit_id, condition, views_count, favorites_count, likes_count, version, published_at, archived_at, auto_delete_at, last_used_at, created_at, updated_at) FROM stdin;
6b86c260-ef3d-4ad3-8f0e-443b0426914c	52c85a1a-39fe-4102-81cd-f1dd05ed671b	1	0	0	iPhone 13 Pro Max	Отличное состояние, использовался 6 месяцев	PUBLISHED	85000.00	1	1	USED	0	0	0	0	\N	\N	\N	\N	2026-03-18 10:30:48.05	2026-03-18 10:30:48.05
ba8aef57-5b5d-4ede-9cdb-eea2e5d4ff8c	52c85a1a-39fe-4102-81cd-f1dd05ed671b	1	0	0	iPhone 13 Pro Max	Отличное состояние, использовался 6 месяцев	PUBLISHED	85000.00	1	1	USED	0	0	0	0	\N	\N	\N	\N	2026-03-18 10:30:52.285	2026-03-18 10:30:52.285
7e1cf2b2-9156-41e1-99fa-798e4aba9565	52c85a1a-39fe-4102-81cd-f1dd05ed671b	1	0	0	iPhone 13 Pro Max	Отличное состояние, использовался 6 месяцев	PUBLISHED	85000.00	1	1	USED	0	0	0	0	\N	\N	\N	\N	2026-03-18 10:30:53.243	2026-03-18 10:30:53.243
\.


--
-- Data for Name: map_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_locations (id, listing_id, type, latitude, longtitude, geo_hash, created_at, "updatedAt") FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, message, is_read, chat_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_items (id, payment_id, item_type, "itemId", item_id_str, quantity, unit_price, description, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, user_id, amount, currency, status, external_id, provider, description, invoice_id, metadata, created_at, updated_at) FROM stdin;
d05919f5-a500-4307-a7ee-117ff9a479cb	52c85a1a-39fe-4102-81cd-f1dd05ed671b	500.00	RUB	COMPLETED	314c91b7-000f-5000-8000-1a7bc97b9971	yookassa	Покупка базовой подписки (100 слотов) на 30 дней	\N	{"cacheKey": "payment:52c85a1a-39fe-4102-81cd-f1dd05ed671b:1773829623563", "daysCount": 30, "paymentId": "d05919f5-a500-4307-a7ee-117ff9a479cb", "paymentType": "BUY_BASE_SUBSCRIPTION"}	2026-03-18 10:27:03.95	2026-03-18 10:27:03.978
\.


--
-- Data for Name: pinned_chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pinned_chats (id, user_id, chat_id, pinned_at) FROM stdin;
\.


--
-- Data for Name: review_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_files (id, review_id, s3_key, s3_bucket, url, file_type, file_name, file_size, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: review_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_likes (id, review_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, author_id, target_type, listing_id, target_user_id, rating, title, content, status, likes_count, reports_count, reply_content, reply_at, reply_author_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role, code, type, created_at, updated_at) FROM stdin;
7f3609c1-8858-4a75-8e84-af4319b41473	Зам Менеджер	MANAGER	WORKER	2026-03-16 20:35:52.614	2026-03-16 20:35:52.614
db7e59a4-3eaf-42c5-af76-df61ab9804b8	Менеджер	MANAGER	WORKER	2026-03-16 20:31:54.512	2026-03-16 20:42:40.231
cd54d429-348e-4f6b-9eff-4d68d3f8e972	Финансы	FINANCE	WORKER	2026-03-16 20:42:40.238	2026-03-16 20:42:40.238
0418d130-f898-433b-b771-18594e61569f	Супер администратор	SUPER_ADMIN	ADMIN	2026-03-16 20:42:40.204	2026-03-18 10:04:34.06
1f73cdca-b4ca-4c01-b97e-7d76bbfe9aa4	Пользователь	USER	USER	2026-03-16 20:42:40.217	2026-03-18 10:04:34.069
611ed207-e597-49fe-b06d-d43f995db18a	Премиум	USER_PREMIUM	USER	2026-03-16 20:42:40.219	2026-03-18 10:04:34.072
b1d561ca-e44a-43d1-b25b-dd9138ef13b2	Администратор	ADMIN	WORKER	2026-03-16 20:42:40.221	2026-03-18 10:04:34.074
e43810fa-0f97-44d6-ad04-2302924594cc	Модератор	MODERATOR	WORKER	2026-03-16 20:42:40.223	2026-03-18 10:04:34.076
6fb63b71-21d1-4cec-8cb6-7a12af9b3b12	Поддержка	SUPPORT	WORKER	2026-03-16 20:42:40.224	2026-03-18 10:04:34.078
fb3bc947-0857-4b15-a3d1-ee4270bde27f	Монтажёр	INSTALLER	WORKER	2026-03-16 20:42:40.226	2026-03-18 10:04:34.079
\.


--
-- Data for Name: slot_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slot_packages (id, user_id, slots, price, expires_at, is_active, payment_id, created_at) FROM stdin;
\.


--
-- Data for Name: specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specifications (id, name) FROM stdin;
1	{"en": "Color", "kz": "Түс", "ru": "Цвет"}
2	{"en": "Size", "kz": "Өлшем", "ru": "Размер"}
3	{"en": "Weight", "kz": "Салмақ", "ru": "Вес"}
4	{"en": "Material", "kz": "Материал", "ru": "Материал"}
6	{"en": "Condition", "kz": "Күйі", "ru": "Состояние"}
7	{"en": "Brand", "kz": "Бренд", "ru": "Бренд"}
5	{"en": "Year", "kz": "Шығарылған жылы", "ru": "Год выпуска"}
8	{"en": "Warranty", "kz": "Кепілдік", "ru": "Гарантия"}
10	{"en": "Model", "kz": "Модель", "ru": "Модель"}
9	{"en": "Manufacturer", "kz": "Өндіруші", "ru": "Производитель"}
12	{"en": "SKU", "kz": "Артикул", "ru": "Артикул"}
11	{"en": "Country", "kz": "Ел", "ru": "Страна"}
13	{"en": "Package contents", "kz": "Жинақтама", "ru": "Комплектация"}
\.


--
-- Data for Name: subscription_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_periods (id, subscription_id, days, start_at, end_at, payment_id, created_at) FROM stdin;
335d07ca-3990-4178-9561-76dcc5c88b70	8dff1fd8-dd22-43ab-bccb-505142e78ed9	30	2026-03-18 10:27:03.997	2026-04-17 10:27:03.997	d05919f5-a500-4307-a7ee-117ff9a479cb	2026-03-18 10:27:04.002
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, user_id, tariff_id, is_active, total_slots, created_at, updated_at) FROM stdin;
8dff1fd8-dd22-43ab-bccb-505142e78ed9	52c85a1a-39fe-4102-81cd-f1dd05ed671b	2fc6bd2d-d589-4e8b-9485-aebc4e8ebed9	t	100	2026-03-18 10:27:03.998	2026-03-18 10:27:03.998
\.


--
-- Data for Name: tariffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tariffs (id, code, name, description, base_slots, base_days, max_total_days, is_extendable, price, currency_code, is_active, created_at, updated_at) FROM stdin;
2fc6bd2d-d589-4e8b-9485-aebc4e8ebed9	BASE	Базовая подписка	Базовая подписка с 100 слотами	100	30	365	t	500.00	RUB	t	2026-03-18 10:05:41.702	2026-03-18 10:05:41.702
\.


--
-- Data for Name: unit_measurements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_measurements (id, name) FROM stdin;
5	{"en": "per box", "kz": "қорап", "ru": "за коробку"}
4	{"en": "per kit", "kz": "жиынтық", "ru": "за набор"}
2	{"en": "per unit", "kz": "бірлік", "ru": "за единицу"}
6	{"en": "per package", "kz": "орама", "ru": "за упаковку"}
3	{"en": "per set", "kz": "жиынтық", "ru": "за комплект"}
1	{"en": "per piece", "kz": "дана", "ru": "за штуку"}
7	{"en": "per copy", "kz": "дана", "ru": "за экземпляр"}
8	{"en": "per license", "kz": "лицензия", "ru": "за лицензию"}
9	{"en": "per ticket", "kz": "билет", "ru": "за билет"}
11	{"en": "per seat", "kz": "орын", "ru": "за место"}
12	{"en": "per gram (g)", "kz": "грамм", "ru": "за грамм (г)"}
13	{"en": "per order", "kz": "тапсырыс", "ru": "за заказ"}
10	{"en": "per slot", "kz": "слот", "ru": "за слот"}
14	{"en": "per milligram (mg)", "kz": "миллиграмм", "ru": "за миллиграмм (мг)"}
15	{"en": "per ton (t)", "kz": "тонна", "ru": "за тонну (т)"}
19	{"en": "per ounce (oz)", "kz": "унция", "ru": "за унцию (oz)"}
17	{"en": "per container", "kz": "контейнер", "ru": "за контейнер"}
22	{"en": "per milliliter (ml)", "kz": "миллилитр", "ru": "за миллилитр (мл)"}
16	{"en": "per kilogram (kg)", "kz": "килограмм", "ru": "за килограмм (кг)"}
20	{"en": "per troy ounce", "kz": "троя унциясы", "ru": "за тройскую унцию"}
21	{"en": "per pound (lb)", "kz": "фунт", "ru": "за фунт (lb)"}
18	{"en": "per centner", "kz": "центнер", "ru": "за центнер"}
23	{"en": "per liter (l)", "kz": "литр", "ru": "за литр (л)"}
24	{"en": "per hectoliter", "kz": "гектолитр", "ru": "за гектолитр"}
25	{"en": "per barrel", "kz": "баррель", "ru": "за баррель"}
26	{"en": "per gallon", "kz": "галлон", "ru": "за галлон"}
27	{"en": "per millimeter (mm)", "kz": "миллиметр", "ru": "за миллиметр (мм)"}
28	{"en": "per centimeter (cm)", "kz": "сантиметр", "ru": "за сантиметр (см)"}
29	{"en": "per meter (m)", "kz": "метр", "ru": "за метр (м)"}
30	{"en": "per linear meter", "kz": "жүгіртпе метр", "ru": "за погонный метр"}
31	{"en": "per kilometer (km)", "kz": "километр", "ru": "за километр (км)"}
32	{"en": "per inch", "kz": "дюйм", "ru": "за дюйм"}
33	{"en": "per foot", "kz": "фут", "ru": "за фут"}
34	{"en": "per square meter (m²)", "kz": "шаршы метр", "ru": "за квадратный метр (м²)"}
35	{"en": "per hectare", "kz": "гектар", "ru": "за гектар"}
36	{"en": "per acre", "kz": "акр", "ru": "за акр"}
37	{"en": "per minute", "kz": "минут", "ru": "за минуту"}
40	{"en": "per shift", "kz": "ауысым", "ru": "за смену"}
39	{"en": "per hour", "kz": "сағат", "ru": "за час"}
38	{"en": "per pallet", "kz": "паллет", "ru": "за паллету"}
42	{"en": "per day", "kz": "күн", "ru": "за день"}
43	{"en": "per week", "kz": "апта", "ru": "за неделю"}
45	{"en": "per year", "kz": "жыл", "ru": "за год"}
44	{"en": "per print run", "kz": "тираж", "ru": "за тираж"}
41	{"en": "per batch", "kz": "партия", "ru": "за партию"}
46	{"en": "per month", "kz": "ай", "ru": "за месяц"}
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
-- Data for Name: user_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_slots (id, user_id, slot_index, source_type, source_id, created_at, expires_at, "slotPackageId", "subscriptionId") FROM stdin;
14f00031-3fa8-4172-9cc1-ac93cae9df67	52c85a1a-39fe-4102-81cd-f1dd05ed671b	1	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
c895b8ca-e414-4194-b7ed-1f6efdaa0aea	52c85a1a-39fe-4102-81cd-f1dd05ed671b	2	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
d2efe148-c6fa-4d62-9fe6-bb9e8594eb0d	52c85a1a-39fe-4102-81cd-f1dd05ed671b	3	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
c2eff2c5-8abb-4f84-999d-95e8718a4488	52c85a1a-39fe-4102-81cd-f1dd05ed671b	4	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
cb9e0369-7d5b-454a-8c6f-f87efac6598a	52c85a1a-39fe-4102-81cd-f1dd05ed671b	5	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
a97ca9b2-bc7a-4ebd-9a94-9619c88ab677	52c85a1a-39fe-4102-81cd-f1dd05ed671b	6	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
b8084811-4e85-4dfd-b678-e20ad55af503	52c85a1a-39fe-4102-81cd-f1dd05ed671b	7	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
b67b4440-bc77-4ef7-99bb-c920d59dc6a7	52c85a1a-39fe-4102-81cd-f1dd05ed671b	8	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
50b7023d-a2ab-4a21-8953-9e4cdb87cc8b	52c85a1a-39fe-4102-81cd-f1dd05ed671b	9	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
52be24c1-ef41-4996-9e72-73d576d55a62	52c85a1a-39fe-4102-81cd-f1dd05ed671b	10	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
84d06004-0ee8-481f-9ba5-cc035ec693c7	52c85a1a-39fe-4102-81cd-f1dd05ed671b	11	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
ef1bca75-34db-455a-837b-614b0ecb36b5	52c85a1a-39fe-4102-81cd-f1dd05ed671b	12	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
0134331e-64d2-4460-a63d-e9f37a02e973	52c85a1a-39fe-4102-81cd-f1dd05ed671b	13	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
a47c532c-4e43-4a8d-abc5-92f72318c735	52c85a1a-39fe-4102-81cd-f1dd05ed671b	14	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
175e462c-dc12-45fd-8283-95c5bc0fb563	52c85a1a-39fe-4102-81cd-f1dd05ed671b	15	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
56ccd58f-e77a-4fd7-875e-93bb3e125643	52c85a1a-39fe-4102-81cd-f1dd05ed671b	16	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
c8daaa9d-ff0d-4abb-8768-3632e6543477	52c85a1a-39fe-4102-81cd-f1dd05ed671b	17	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
4f548ee6-4477-4bdf-b9fe-b2662128f891	52c85a1a-39fe-4102-81cd-f1dd05ed671b	18	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
b0683b86-0b7c-4bf2-9c61-b7ceafac3422	52c85a1a-39fe-4102-81cd-f1dd05ed671b	19	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
20a985e0-a3a1-4cea-a475-49df89bbc5e2	52c85a1a-39fe-4102-81cd-f1dd05ed671b	20	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
97b4f3d2-760d-46c3-95f4-5e57f5f32d3e	52c85a1a-39fe-4102-81cd-f1dd05ed671b	21	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
55d6115d-0bf7-419f-8736-f0282d810c6e	52c85a1a-39fe-4102-81cd-f1dd05ed671b	22	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
d1a636d7-8ce1-4f88-a2eb-aa71d4b8ea49	52c85a1a-39fe-4102-81cd-f1dd05ed671b	23	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fe153484-7579-4966-b674-b140d537310f	52c85a1a-39fe-4102-81cd-f1dd05ed671b	24	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
cb672429-9503-4de9-b313-97e96265b9b8	52c85a1a-39fe-4102-81cd-f1dd05ed671b	25	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
677e53b5-ff77-44f6-bdbb-5df28d468b91	52c85a1a-39fe-4102-81cd-f1dd05ed671b	26	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
f53c3f5b-2b2b-4da7-a036-35df2f836c90	52c85a1a-39fe-4102-81cd-f1dd05ed671b	27	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
494b44de-7491-4c64-a55a-3c07e2882859	52c85a1a-39fe-4102-81cd-f1dd05ed671b	28	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fb321155-8a5f-4816-ad0d-dcefc7680340	52c85a1a-39fe-4102-81cd-f1dd05ed671b	29	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
c4ead4fe-609a-4d1d-b1f1-7df1fe8219b5	52c85a1a-39fe-4102-81cd-f1dd05ed671b	30	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5b78d17f-08fb-44dc-b77b-0a98d2e5a9ff	52c85a1a-39fe-4102-81cd-f1dd05ed671b	31	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
a641769a-4b76-4120-a705-89c58c9aa02b	52c85a1a-39fe-4102-81cd-f1dd05ed671b	32	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
ad7f5c08-954c-4e7f-97f5-bd3e2c5e99f6	52c85a1a-39fe-4102-81cd-f1dd05ed671b	33	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
719ab653-db23-4b6a-9b59-24c301c64fc1	52c85a1a-39fe-4102-81cd-f1dd05ed671b	34	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
8c0d4b33-2da5-41b6-b51c-114329e7048a	52c85a1a-39fe-4102-81cd-f1dd05ed671b	35	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fe8ecbf4-0059-41ff-9463-3564b83420dd	52c85a1a-39fe-4102-81cd-f1dd05ed671b	36	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
dc4beda8-0a17-4e23-a1bc-c3fda0304cbc	52c85a1a-39fe-4102-81cd-f1dd05ed671b	37	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
f8c9f3ae-26d1-4547-9371-2c83badb25a6	52c85a1a-39fe-4102-81cd-f1dd05ed671b	38	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
249b9cfd-2098-46da-a2d1-fa579f6c549d	52c85a1a-39fe-4102-81cd-f1dd05ed671b	39	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
706a70a2-5a1d-4a75-9733-9e9b387e02f2	52c85a1a-39fe-4102-81cd-f1dd05ed671b	40	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
73094b12-2cd2-480f-b123-4b09ff085b57	52c85a1a-39fe-4102-81cd-f1dd05ed671b	41	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5b52534d-98a9-479a-bc69-2b1d6d0a46ff	52c85a1a-39fe-4102-81cd-f1dd05ed671b	42	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
0d9750d9-954e-45b3-a7bf-414e9ba557a5	52c85a1a-39fe-4102-81cd-f1dd05ed671b	43	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
8ebee5d8-0ef2-4e25-a287-12e5ec2bcd35	52c85a1a-39fe-4102-81cd-f1dd05ed671b	44	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
ce595bcd-df9a-4e39-8721-403dcf459399	52c85a1a-39fe-4102-81cd-f1dd05ed671b	45	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
0f93548d-f7a1-4ef9-98eb-5ae071ba0b29	52c85a1a-39fe-4102-81cd-f1dd05ed671b	46	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
691d5bcb-0660-4d49-9a6d-a485c0f4e91e	52c85a1a-39fe-4102-81cd-f1dd05ed671b	47	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
021b8922-adf8-4390-aeb6-d7016a25e6fb	52c85a1a-39fe-4102-81cd-f1dd05ed671b	48	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
e7f77cde-b190-47fe-91b6-af66cc758399	52c85a1a-39fe-4102-81cd-f1dd05ed671b	49	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
4f189e7c-5b6e-4ebd-a420-f92b2dab5319	52c85a1a-39fe-4102-81cd-f1dd05ed671b	50	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
3346c24b-5354-445e-897d-0d11ed16ea05	52c85a1a-39fe-4102-81cd-f1dd05ed671b	51	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
61c03031-2d34-49f1-a8c5-526dbaf0dd00	52c85a1a-39fe-4102-81cd-f1dd05ed671b	52	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
6ffd54f5-893e-4ead-bc83-31476e7450e9	52c85a1a-39fe-4102-81cd-f1dd05ed671b	53	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5c3ab2b8-b87d-4403-9714-2c9402c43417	52c85a1a-39fe-4102-81cd-f1dd05ed671b	54	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
c53c2a5f-81d2-4452-bc4d-96b6f4a767d8	52c85a1a-39fe-4102-81cd-f1dd05ed671b	55	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
8d0ad584-1dce-4fe5-a9f9-9238be3a521a	52c85a1a-39fe-4102-81cd-f1dd05ed671b	56	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
11d31dce-ae00-4bce-b833-66b086cba086	52c85a1a-39fe-4102-81cd-f1dd05ed671b	57	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
da5065f6-8787-4e00-95ff-44c4b3c74254	52c85a1a-39fe-4102-81cd-f1dd05ed671b	58	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
466566d4-bd6c-4402-b28d-6f40feff5ad6	52c85a1a-39fe-4102-81cd-f1dd05ed671b	59	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
9a723fbc-1eb4-47c4-a897-22265159c3c7	52c85a1a-39fe-4102-81cd-f1dd05ed671b	60	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
7c01b1e0-e4ee-4cb6-b056-0fc0c54918c5	52c85a1a-39fe-4102-81cd-f1dd05ed671b	61	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
289cccde-ddec-4a8e-b83f-ccbf5abdc262	52c85a1a-39fe-4102-81cd-f1dd05ed671b	62	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
11e93233-df2e-4637-8015-a158b1c6be0f	52c85a1a-39fe-4102-81cd-f1dd05ed671b	63	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fbca93c9-ac88-4797-b525-ec37e76d1761	52c85a1a-39fe-4102-81cd-f1dd05ed671b	64	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
30fb7969-b209-40bf-9b7d-7a450ee6fe79	52c85a1a-39fe-4102-81cd-f1dd05ed671b	65	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
60ff09ae-a362-4a2d-87a6-97236dc0db67	52c85a1a-39fe-4102-81cd-f1dd05ed671b	66	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
2c85017c-c4a4-4b42-bdec-c53ff8778666	52c85a1a-39fe-4102-81cd-f1dd05ed671b	67	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
d66b683c-a182-4025-a04f-c21a7def79a6	52c85a1a-39fe-4102-81cd-f1dd05ed671b	68	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fa5ac711-e20c-4339-b2a5-7daafac788ac	52c85a1a-39fe-4102-81cd-f1dd05ed671b	69	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
2d8ec717-55d2-4286-8717-66d9046fdfc1	52c85a1a-39fe-4102-81cd-f1dd05ed671b	70	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
84975a0c-6c04-4ff4-947f-4e954283062c	52c85a1a-39fe-4102-81cd-f1dd05ed671b	71	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
96ecc1d1-4bcc-43a0-b421-6840f00006f8	52c85a1a-39fe-4102-81cd-f1dd05ed671b	72	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5dd4b252-6ab1-4923-88ad-52cb3cb6f286	52c85a1a-39fe-4102-81cd-f1dd05ed671b	73	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
fc7e7b34-c21f-40c5-ae40-0d822473019a	52c85a1a-39fe-4102-81cd-f1dd05ed671b	74	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
1f452343-cb49-4f37-a233-e3672e328f87	52c85a1a-39fe-4102-81cd-f1dd05ed671b	75	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5a26ec6c-9814-41cb-9d0f-fe81fb018f8c	52c85a1a-39fe-4102-81cd-f1dd05ed671b	76	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
f81556a5-2e94-4ff0-a643-d354f74ead37	52c85a1a-39fe-4102-81cd-f1dd05ed671b	77	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
811458e2-a3e9-411a-a27d-e772174c26ce	52c85a1a-39fe-4102-81cd-f1dd05ed671b	78	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
50da13c8-640a-4990-809d-e7216f57bf92	52c85a1a-39fe-4102-81cd-f1dd05ed671b	79	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
52c3c517-e0d9-46f0-82c6-c7db1b0760a3	52c85a1a-39fe-4102-81cd-f1dd05ed671b	80	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
97252b10-fe5a-4c6d-8771-a2774c0fb5d8	52c85a1a-39fe-4102-81cd-f1dd05ed671b	81	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
dc565bf9-b3a1-4de3-acdd-485ad69b94e7	52c85a1a-39fe-4102-81cd-f1dd05ed671b	82	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
0d47c523-de61-455d-9083-c10f3a83b678	52c85a1a-39fe-4102-81cd-f1dd05ed671b	83	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
746303f3-35b8-41f7-afa5-8f01ec0ea63b	52c85a1a-39fe-4102-81cd-f1dd05ed671b	84	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
2466825d-0026-427a-b479-ba0a1c608215	52c85a1a-39fe-4102-81cd-f1dd05ed671b	85	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
011735af-46a3-4404-b0d9-101c7911463f	52c85a1a-39fe-4102-81cd-f1dd05ed671b	86	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5e977619-a608-448d-85fd-7583badd8810	52c85a1a-39fe-4102-81cd-f1dd05ed671b	87	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
da767c4b-0a0e-4985-9904-138504ae4dab	52c85a1a-39fe-4102-81cd-f1dd05ed671b	88	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
377c756e-ea7c-42fc-ba25-e016bddbefbc	52c85a1a-39fe-4102-81cd-f1dd05ed671b	89	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
70de5bb1-09f8-4df7-a15d-e82eaed8edca	52c85a1a-39fe-4102-81cd-f1dd05ed671b	90	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
4cbd3fa2-2258-4b8d-91cf-f168bd8d164b	52c85a1a-39fe-4102-81cd-f1dd05ed671b	91	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
b2c1635b-87af-434e-a02a-b16aaf186b9e	52c85a1a-39fe-4102-81cd-f1dd05ed671b	92	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5ec492da-7e4b-460c-ac72-9eabcf871d99	52c85a1a-39fe-4102-81cd-f1dd05ed671b	93	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
ad334ff3-fe60-4988-85d9-7be7aaf72708	52c85a1a-39fe-4102-81cd-f1dd05ed671b	94	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
47f07478-3a1f-40a8-baa3-5717199b6813	52c85a1a-39fe-4102-81cd-f1dd05ed671b	95	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
66171a88-cd81-4a98-98c8-44b3b517e5a0	52c85a1a-39fe-4102-81cd-f1dd05ed671b	96	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
26d3aebf-f87f-4dc6-b170-f0bd6e645cd1	52c85a1a-39fe-4102-81cd-f1dd05ed671b	97	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
5f63a084-e755-430a-91e4-0cd0016f6256	52c85a1a-39fe-4102-81cd-f1dd05ed671b	98	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
121fc2fe-2ae0-4bf5-8af4-45555937bea0	52c85a1a-39fe-4102-81cd-f1dd05ed671b	99	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
b8285e44-7350-4cda-89b8-f84caa122b41	52c85a1a-39fe-4102-81cd-f1dd05ed671b	100	SUBSCRIPTION	8dff1fd8-dd22-43ab-bccb-505142e78ed9	2026-03-18 10:27:04.023	2026-04-17 10:27:03.997	\N	8dff1fd8-dd22-43ab-bccb-505142e78ed9
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, "accountNumber", password, is_verified, rating, reviews_count, role_id, created_at, updated_at) FROM stdin;
52c85a1a-39fe-4102-81cd-f1dd05ed671b	admin@admin.com	Admin	61670957	$argon2id$v=19$m=65536,t=3,p=1$feeaBXfikk7JmNUz8pps5g$Y3adK5/21zfNRYEQeCBoBX6YkE7nm30xaEQGaBoTwj0	t	0	0	0418d130-f898-433b-b771-18594e61569f	2026-03-16 20:45:39.893	2026-03-16 20:45:39.893
5bfec98a-71d3-4323-b121-5208e1ae88a0	ibadtoff@gmail.com		86095826	$argon2id$v=19$m=65536,t=3,p=1$z1+OwgCLZqNxoJD66uFb2w$WKq57AV2FmPapPm/Ow9o88V9dmYUchh2WAHVVAcCn+I	t	3.25	4	1f73cdca-b4ca-4c01-b97e-7d76bbfe9aa4	2026-03-16 22:01:04.999	2026-03-17 20:07:16.824
\.


--
-- Data for Name: users_chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_chats (id, user_id, chats_id) FROM stdin;
\.


--
-- Data for Name: workers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workers (id, name, phone, email, "isAcitve", role_id, user_id, created_at, updated_at) FROM stdin;
c67f93fc-86cf-40b9-9b65-97a9f0b4e40e	Петров Василий	+79991234567	petrov@example.com	t	6fb63b71-21d1-4cec-8cb6-7a12af9b3b12	52c85a1a-39fe-4102-81cd-f1dd05ed671b	2026-03-16 20:47:00.133	2026-03-16 20:47:00.133
a3dd6d60-dece-43ea-bf8c-2fe46d467d83	Иванов Иван Иванович	+79991234567	ivanov@example.com	t	db7e59a4-3eaf-42c5-af76-df61ab9804b8	52c85a1a-39fe-4102-81cd-f1dd05ed671b	2026-03-16 20:46:22.937	2026-03-16 20:48:08.76
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: category_specifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_specifications_id_seq', 1, false);


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currencies_id_seq', 6, true);


--
-- Name: currency_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currency_rates_id_seq', 1, false);


--
-- Name: specifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.specifications_id_seq', 13, true);


--
-- Name: unit_measurements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_measurements_id_seq', 56, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_specifications category_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_pkey PRIMARY KEY (id);


--
-- Name: chat_files chat_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_pkey PRIMARY KEY (id);


--
-- Name: chat_participants chat_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: currency_rates currency_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_rates
    ADD CONSTRAINT currency_rates_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: listing_likes listing_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_pkey PRIMARY KEY (id);


--
-- Name: listing_slots listing_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_pkey PRIMARY KEY (id);


--
-- Name: listing_specifications listing_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_specifications
    ADD CONSTRAINT listing_specifications_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: map_locations map_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_locations
    ADD CONSTRAINT map_locations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: payment_items payment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_items
    ADD CONSTRAINT payment_items_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: pinned_chats pinned_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_pkey PRIMARY KEY (id);


--
-- Name: review_files review_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_files
    ADD CONSTRAINT review_files_pkey PRIMARY KEY (id);


--
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: slot_packages slot_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slot_packages
    ADD CONSTRAINT slot_packages_pkey PRIMARY KEY (id);


--
-- Name: specifications specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specifications
    ADD CONSTRAINT specifications_pkey PRIMARY KEY (id);


--
-- Name: subscription_periods subscription_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_periods
    ADD CONSTRAINT subscription_periods_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tariffs tariffs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_pkey PRIMARY KEY (id);


--
-- Name: unit_measurements unit_measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_measurements
    ADD CONSTRAINT unit_measurements_pkey PRIMARY KEY (id);


--
-- Name: user_slots user_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT user_slots_pkey PRIMARY KEY (id);


--
-- Name: users_chats users_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workers workers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_pkey PRIMARY KEY (id);


--
-- Name: categories_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_name_idx ON public.categories USING btree (name);


--
-- Name: categories_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "categories_parentId_idx" ON public.categories USING btree ("parentId");


--
-- Name: categories_parentId_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "categories_parentId_name_idx" ON public.categories USING btree ("parentId", name);


--
-- Name: category_specifications_category_id_specification_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX category_specifications_category_id_specification_id_key ON public.category_specifications USING btree (category_id, specification_id);


--
-- Name: chat_participants_user_id_chat_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX chat_participants_user_id_chat_id_key ON public.chat_participants USING btree (user_id, chat_id);


--
-- Name: complaints_author_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX complaints_author_id_idx ON public.complaints USING btree (author_id);


--
-- Name: complaints_complaintType_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "complaints_complaintType_listing_id_idx" ON public.complaints USING btree ("complaintType", listing_id);


--
-- Name: complaints_complaintType_target_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "complaints_complaintType_target_user_id_idx" ON public.complaints USING btree ("complaintType", target_user_id);


--
-- Name: currencies_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX currencies_code_key ON public.currencies USING btree (code);


--
-- Name: currency_rates_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX currency_rates_code_key ON public.currency_rates USING btree (code);


--
-- Name: donations_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX donations_user_id_idx ON public.donations USING btree (user_id);


--
-- Name: favorites_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX favorites_listing_id_idx ON public.favorites USING btree (listing_id);


--
-- Name: favorites_target_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX favorites_target_user_id_idx ON public.favorites USING btree (target_user_id);


--
-- Name: favorites_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX favorites_user_id_idx ON public.favorites USING btree (user_id);


--
-- Name: favorites_user_id_type_listing_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_type_listing_id_key ON public.favorites USING btree (user_id, type, listing_id);


--
-- Name: favorites_user_id_type_target_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX favorites_user_id_type_target_user_id_key ON public.favorites USING btree (user_id, type, target_user_id);


--
-- Name: files_complaint_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_complaint_id_idx ON public.files USING btree (complaint_id);


--
-- Name: files_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_listing_id_idx ON public.files USING btree (listing_id);


--
-- Name: files_listing_id_kind_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_listing_id_kind_sort_order_idx ON public.files USING btree (listing_id, kind, sort_order);


--
-- Name: files_owner_type_complaint_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_complaint_id_idx ON public.files USING btree (owner_type, complaint_id);


--
-- Name: files_owner_type_complaint_id_kind_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_complaint_id_kind_idx ON public.files USING btree (owner_type, complaint_id, kind);


--
-- Name: files_owner_type_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_listing_id_idx ON public.files USING btree (owner_type, listing_id);


--
-- Name: files_owner_type_listing_id_kind_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_listing_id_kind_idx ON public.files USING btree (owner_type, listing_id, kind);


--
-- Name: files_owner_type_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_user_id_idx ON public.files USING btree (owner_type, user_id);


--
-- Name: files_owner_type_user_id_kind_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_owner_type_user_id_kind_idx ON public.files USING btree (owner_type, user_id, kind);


--
-- Name: files_upload_status_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_upload_status_expires_at_idx ON public.files USING btree (upload_status, expires_at);


--
-- Name: files_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_user_id_idx ON public.files USING btree (user_id);


--
-- Name: listing_likes_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listing_likes_listing_id_idx ON public.listing_likes USING btree (listing_id);


--
-- Name: listing_likes_listing_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX listing_likes_listing_id_user_id_key ON public.listing_likes USING btree (listing_id, user_id);


--
-- Name: listing_likes_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listing_likes_user_id_idx ON public.listing_likes USING btree (user_id);


--
-- Name: listing_slots_listing_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX listing_slots_listing_id_key ON public.listing_slots USING btree (listing_id);


--
-- Name: listing_slots_user_slot_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX listing_slots_user_slot_id_key ON public.listing_slots USING btree (user_slot_id);


--
-- Name: listing_slots_user_slot_id_released_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listing_slots_user_slot_id_released_at_idx ON public.listing_slots USING btree (user_slot_id, released_at);


--
-- Name: listing_specifications_listing_id_specification_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX listing_specifications_listing_id_specification_id_key ON public.listing_specifications USING btree (listing_id, specification_id);


--
-- Name: listings_condition_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_condition_status_idx ON public.listings USING btree (condition, status);


--
-- Name: listings_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_created_at_idx ON public.listings USING btree (created_at);


--
-- Name: listings_price_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_price_status_idx ON public.listings USING btree (price, status);


--
-- Name: listings_status_auto_delete_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_status_auto_delete_at_idx ON public.listings USING btree (status, auto_delete_at);


--
-- Name: listings_status_condition_subcategory_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_status_condition_subcategory_id_idx ON public.listings USING btree (status, condition, subcategory_id);


--
-- Name: listings_status_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_status_created_at_idx ON public.listings USING btree (status, created_at);


--
-- Name: listings_status_last_used_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_status_last_used_at_idx ON public.listings USING btree (status, last_used_at);


--
-- Name: listings_subcategory_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_subcategory_id_status_idx ON public.listings USING btree (subcategory_id, status);


--
-- Name: listings_subcategory_id_status_published_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_subcategory_id_status_published_at_idx ON public.listings USING btree (subcategory_id, status, published_at);


--
-- Name: listings_user_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX listings_user_id_status_idx ON public.listings USING btree (user_id, status);


--
-- Name: map_locations_geo_hash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX map_locations_geo_hash_idx ON public.map_locations USING btree (geo_hash);


--
-- Name: map_locations_latitude_longtitude_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX map_locations_latitude_longtitude_idx ON public.map_locations USING btree (latitude, longtitude);


--
-- Name: map_locations_listing_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX map_locations_listing_id_idx ON public.map_locations USING btree (listing_id);


--
-- Name: messages_chat_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_chat_id_created_at_idx ON public.messages USING btree (chat_id, created_at);


--
-- Name: payment_items_item_type_itemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payment_items_item_type_itemId_idx" ON public.payment_items USING btree (item_type, "itemId");


--
-- Name: payment_items_payment_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payment_items_payment_id_idx ON public.payment_items USING btree (payment_id);


--
-- Name: payments_external_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_external_id_idx ON public.payments USING btree (external_id);


--
-- Name: payments_status_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status_created_at_idx ON public.payments USING btree (status, created_at);


--
-- Name: payments_user_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_user_id_status_idx ON public.payments USING btree (user_id, status);


--
-- Name: review_files_review_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX review_files_review_id_idx ON public.review_files USING btree (review_id);


--
-- Name: review_likes_review_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX review_likes_review_id_user_id_key ON public.review_likes USING btree (review_id, user_id);


--
-- Name: reviews_author_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_author_id_idx ON public.reviews USING btree (author_id);


--
-- Name: reviews_listing_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_listing_id_status_idx ON public.reviews USING btree (listing_id, status);


--
-- Name: reviews_target_user_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_target_user_id_status_idx ON public.reviews USING btree (target_user_id, status);


--
-- Name: roles_role_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_role_key ON public.roles USING btree (role);


--
-- Name: roles_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX roles_type_idx ON public.roles USING btree (type);


--
-- Name: slot_packages_user_id_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX slot_packages_user_id_is_active_idx ON public.slot_packages USING btree (user_id, is_active);


--
-- Name: subscription_periods_subscription_id_end_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX subscription_periods_subscription_id_end_at_idx ON public.subscription_periods USING btree (subscription_id, end_at);


--
-- Name: subscriptions_user_id_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX subscriptions_user_id_is_active_idx ON public.subscriptions USING btree (user_id, is_active);


--
-- Name: user_slots_source_type_source_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_slots_source_type_source_id_idx ON public.user_slots USING btree (source_type, source_id);


--
-- Name: user_slots_user_id_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_slots_user_id_expires_at_idx ON public.user_slots USING btree (user_id, expires_at);


--
-- Name: user_slots_user_id_slot_index_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_slots_user_id_slot_index_key ON public.user_slots USING btree (user_id, slot_index);


--
-- Name: users_accountNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_accountNumber_key" ON public.users USING btree ("accountNumber");


--
-- Name: users_chats_index_0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_chats_index_0 ON public.users_chats USING btree (user_id, chats_id);


--
-- Name: users_chats_user_id_chats_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_chats_user_id_chats_id_key ON public.users_chats USING btree (user_id, chats_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: workers_role_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workers_role_id_idx ON public.workers USING btree (role_id);


--
-- Name: workers_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX workers_user_id_idx ON public.workers USING btree (user_id);


--
-- Name: categories categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: category_specifications category_specifications_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: category_specifications category_specifications_specification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_specifications
    ADD CONSTRAINT category_specifications_specification_id_fkey FOREIGN KEY (specification_id) REFERENCES public.specifications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chat_files chat_files_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: chat_files chat_files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_files
    ADD CONSTRAINT chat_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chat_participants chat_participants_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: chat_participants chat_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: complaints complaints_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: complaints complaints_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: complaints complaints_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: donations donations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_complaint_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_complaint_fk FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_listing_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_listing_fk FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files file_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT file_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_likes listing_likes_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_likes listing_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_likes
    ADD CONSTRAINT listing_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_slots listing_slots_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_slots listing_slots_user_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_slots
    ADD CONSTRAINT listing_slots_user_slot_id_fkey FOREIGN KEY (user_slot_id) REFERENCES public.user_slots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listing_specifications listing_specifications_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_specifications
    ADD CONSTRAINT listing_specifications_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listings listings_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_price_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_price_unit_id_fkey FOREIGN KEY (price_unit_id) REFERENCES public.unit_measurements(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: listings listings_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: listings listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_locations map_locations_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_locations
    ADD CONSTRAINT map_locations_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: payment_items payment_items_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_items
    ADD CONSTRAINT payment_items_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pinned_chats pinned_chats_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id);


--
-- Name: pinned_chats pinned_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pinned_chats
    ADD CONSTRAINT pinned_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: review_files review_files_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_files
    ADD CONSTRAINT review_files_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: slot_packages slot_packages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slot_packages
    ADD CONSTRAINT slot_packages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscription_periods subscription_periods_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_periods
    ADD CONSTRAINT subscription_periods_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_tariff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_tariff_id_fkey FOREIGN KEY (tariff_id) REFERENCES public.tariffs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_slots user_slots_slotPackageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT "user_slots_slotPackageId_fkey" FOREIGN KEY ("slotPackageId") REFERENCES public.slot_packages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_slots user_slots_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT "user_slots_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_slots user_slots_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_slots
    ADD CONSTRAINT user_slots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_chats users_chats_chats_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_chats_id_fkey FOREIGN KEY (chats_id) REFERENCES public.chats(id);


--
-- Name: users_chats users_chats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_chats
    ADD CONSTRAINT users_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workers workers_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: workers workers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

