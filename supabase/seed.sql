insert into public.content_items (slug, phrase, meaning, example, region, type, context, tone)
values
  ('move-the-needle', 'Move the needle', 'Create a noticeable or meaningful impact.', 'Let''s focus on the two initiatives most likely to move the needle this quarter.', 'United States', 'Idiom', '{Strategy,Results}', 'Polished'),
  ('double-click-on-that', 'Double-click on that', 'Explore one point in greater detail.', 'Could we double-click on the customer retention number?', 'United States', 'Slang', '{Clarifying,Data}', 'Neutral'),
  ('give-er', 'Give’er', 'Put in a strong effort or proceed energetically.', 'The plan is solid—let’s give’er and get the pilot out this week.', 'Canada', 'Slang', '{Motivation,Casual}', 'Casual'),
  ('thoughtful', 'Thoughtful', 'Carefully considered and attentive to consequences.', 'That’s a thoughtful way to sequence the rollout.', 'Global', 'Power word', '{Praise,Feedback}', 'Polished'),
  ('building-on-that', 'Building on that', 'Connect your point constructively to a previous idea.', 'Building on Priya’s point, we can test this with one region first.', 'Global', 'Transition', '{Collaboration,Meetings}', 'Polished')
on conflict (slug) do update set
  phrase = excluded.phrase,
  meaning = excluded.meaning,
  example = excluded.example,
  region = excluded.region,
  type = excluded.type,
  context = excluded.context,
  tone = excluded.tone,
  is_published = true;
