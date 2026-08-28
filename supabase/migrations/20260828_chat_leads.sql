-- Chat leads: captured when AI handoff to WhatsApp fires
create table if not exists chat_leads (
  id          bigserial primary key,
  created_at  timestamptz default now(),
  brand       text,
  nama_merek  text,
  kelas_nice  text,
  jenis_entitas text,
  nama_user   text,
  source      text default 'ai_chat'
);

-- Allow web visitors to INSERT (anon key), block SELECT
alter table chat_leads enable row level security;

create policy "insert_anon" on chat_leads
  for insert to anon with check (true);

-- To read leads: use service role key in dashboard/admin only
