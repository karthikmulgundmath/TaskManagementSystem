--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid,
    author_id uuid,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    task_id uuid,
    message character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    owner_id uuid
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: task_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid,
    updated_at timestamp without time zone DEFAULT now(),
    previous_status character varying(50),
    new_status character varying(50),
    changed_by uuid
);


ALTER TABLE public.task_logs OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(50),
    priority character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    due_date timestamp without time zone,
    project_id uuid,
    assigned_user_id uuid,
    CONSTRAINT tasks_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))),
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'contributor'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, task_id, author_id, content, created_at) FROM stdin;
dcfcf321-d9ec-4ddb-a7fd-700a1b4f1801	93b7a7e9-fdf8-491d-9887-064a2e29fff5	d2c01d57-33d4-47d3-9fe3-ae3aafce52fd	I have started to work on this pubsub Notification	2024-10-20 14:04:12.316
61d79932-b929-4275-be2f-16fdfde58119	93b7a7e9-fdf8-491d-9887-064a2e29fff5	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9	Make sure u do it before 21st please	2024-10-20 14:13:18.967
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, task_id, message, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, owner_id) FROM stdin;
1d77b30e-c86e-488d-ae35-9198565d733c	Task Management System	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
\.


--
-- Data for Name: task_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_logs (id, task_id, updated_at, previous_status, new_status, changed_by) FROM stdin;
d0633fb9-75e2-4ac3-951f-539c44a73986	93b7a7e9-fdf8-491d-9887-064a2e29fff5	2024-10-20 13:45:06.469	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
08ea5ca8-169a-411c-929c-0d5fa66fb492	93b7a7e9-fdf8-491d-9887-064a2e29fff5	2024-10-20 13:45:58.267	pending	in_progress	d2c01d57-33d4-47d3-9fe3-ae3aafce52fd
044111cb-0dea-472d-a5b1-1c57f2eca60a	f4b7c56d-f582-4ce2-bcb5-64be999f71b5	2024-10-20 18:21:16.174	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
aa935dc2-a22b-4261-a778-540757f28d1a	fec5962b-577a-42e7-be2b-f2e475e37338	2024-10-20 18:21:43.871	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
93a62413-ea35-481d-9140-1e3d1b4ab2b0	a35cb7e5-65de-4be2-8d91-a0090a35106e	2024-10-20 18:34:40.781	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
d20037ee-15e1-427c-9c2c-9210b6b7a3ca	b178f647-fcd3-4606-a885-a6973821cba5	2024-10-20 18:36:02.299	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
913c936f-e958-4387-a7fd-3a6c221f77a9	31fdc356-0718-4d11-a806-9bc631180af3	2024-10-20 19:14:17.041	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
3948f530-b03e-48a5-880c-c9ca980ee526	b4d725a9-dad6-419d-a3a3-4e9363fa44e0	2024-10-20 19:16:03.599	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
c7356128-9d4b-48af-af5a-a78cfd73a466	5da34bc1-5193-414d-be76-d04c3e8ef1d7	2024-10-20 19:24:16.973	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
0971dec3-7e27-4b33-9871-3e29629540ea	422abe39-646a-4d1d-947f-e1563bf1f2df	2024-10-20 19:28:02.043	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
3d8cf076-6919-46b4-a3d6-c51175232148	7ed1ae5a-6ae7-4e47-8935-2c3d602a8af4	2024-10-20 19:31:48.183	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
ac134345-39ea-4793-826d-025a5f6fef65	33a21ac9-37c6-4573-8626-a5be378b3110	2024-10-20 19:54:16.656	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
c09b060d-8834-4ea0-83f9-2b135ca89620	00716e70-744d-4749-b497-388f71dab388	2024-10-20 20:00:13.42	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
ada0bffd-b3d4-41f0-86a6-10ac4ff5602a	5260c271-9363-41a4-aa69-2eb2f1b6b4c0	2024-10-20 20:01:04.468	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
78c7c3fc-61c2-4731-8e46-ce7c1c3615a1	a0429ccc-49c4-430d-999e-ccb1e877beae	2024-10-20 20:02:03.12	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
83a8ab20-4671-4a46-aaa8-0fd8bbf99cc1	7097e9f7-c243-417d-9afe-99ca5a855ff9	2024-10-20 20:04:22.341	N/A	pending	8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, status, priority, created_at, due_date, project_id, assigned_user_id) FROM stdin;
93b7a7e9-fdf8-491d-9887-064a2e29fff5	Implement pubsub for notifications	Develop Notification service using pubsub	in_progress	high	2024-10-20 13:45:06.466587	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	d2c01d57-33d4-47d3-9fe3-ae3aafce52fd
f4b7c56d-f582-4ce2-bcb5-64be999f71b5	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 18:21:16.170389	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
fec5962b-577a-42e7-be2b-f2e475e37338	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 18:21:43.870319	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
a35cb7e5-65de-4be2-8d91-a0090a35106e	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 18:34:40.778246	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
b178f647-fcd3-4606-a885-a6973821cba5	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 18:36:02.297803	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
31fdc356-0718-4d11-a806-9bc631180af3	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:14:17.037869	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
b4d725a9-dad6-419d-a3a3-4e9363fa44e0	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:16:03.595591	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
5da34bc1-5193-414d-be76-d04c3e8ef1d7	Write Documentation	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:24:16.966813	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	84664d4c-622c-42f1-854e-a698c251ede9
422abe39-646a-4d1d-947f-e1563bf1f2df	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:28:02.040309	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	e14765bc-0acd-44c9-ae0a-e22b964cc5ba
7ed1ae5a-6ae7-4e47-8935-2c3d602a8af4	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:31:48.180686	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
33a21ac9-37c6-4573-8626-a5be378b3110	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 19:54:16.652792	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
00716e70-744d-4749-b497-388f71dab388	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 20:00:13.418535	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
5260c271-9363-41a4-aa69-2eb2f1b6b4c0	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 20:01:04.467399	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
a0429ccc-49c4-430d-999e-ccb1e877beae	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 20:02:03.118256	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
7097e9f7-c243-417d-9afe-99ca5a855ff9	Write Documentation for the project	Write documentation for project setup and also meaningful comments	pending	high	2024-10-20 20:04:22.33925	2024-10-21 12:00:00	1d77b30e-c86e-488d-ae35-9198565d733c	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role) FROM stdin;
8a23c69b-b7d7-4d3b-aaa1-22cc75f8b7a9	Karthik	karthiksrk40@gmail.com	$2b$10$OpGNr7yNCoOjEcl7tKgW8OHZdCUnLMCGeZ0K2GeJFkusj2xEI0Wji	owner
d2c01d57-33d4-47d3-9fe3-ae3aafce52fd	john doe	johndoe@gmail.com	$2b$10$jbPsY1r559vrPdeBA3zL4uIaBPm7oShcgIU55FkKdaJh9R1l6tyz6	contributor
84664d4c-622c-42f1-854e-a698c251ede9	kartikshree	kartikshree@gmail.com	$2b$10$bH/o0SvRoO2E3Nk0wy/iiOYEVN1pTLFD60lEi71MD1lsMF/oCVXBy	contributor
e14765bc-0acd-44c9-ae0a-e22b964cc5ba	Santosh	santoshkumar.vyakaranal@gmail.com	$2b$10$MKyb0rRR9XVb0Ol/hB1Ix.p2c8OIZEP.Q84WnPFVcHshtraXi4aPC	contributor
\.


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: task_logs task_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: task_logs task_logs_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: task_logs task_logs_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_logs
    ADD CONSTRAINT task_logs_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

