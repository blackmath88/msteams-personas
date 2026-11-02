/*
 * M365 application renderers. Pure functions: (viewModel, options) -> HTML string.
 * Every app renders at a fixed design viewport (1440 x 810 CSS px) so that the workspace
 * preview, the presentation stage and the PNG export share exactly the same geometry.
 *
 * Profiles (see docs/REFERENCE-PROFILES.md):
 *   Teams      – new Teams desktop (2024+), German, light, separate Teams view, channel layout «Beiträge»
 *   Outlook    – new Outlook / Outlook im Web, German, light, three-pane with reading pane right
 *   Explorer   – Windows 11 File Explorer, German (CH), light, details view
 *   SharePoint – SharePoint Online team site, modern document library, German, light
 *
 * Options: { annot: bool, tab: 'posts'|'files'|'tasks' }. Teaching marks are small numbered
 * badges only; the explanatory notes live outside the app (slide column / workspace).
 */
(function (root) {
  var V = root.Views, esc = V.esc, short = V.short, initials = V.initials;
  var W = 1440, H = 810;

  /* ---------- inline Fluent UI System Icons, 20 px (inline so PNG export needs no sprite) ----------
   * Paths from @fluentui/svg-icons 1.1.340, MIT, Copyright (c) 2020 Microsoft Corporation; see
   * THIRD-PARTY-NOTICES.md. Regular weight; PF holds the filled variant Teams shows for the
   * selected rail item and for ticks. Regenerate with tools/gen-fluent-icons.mjs. */
  var P = {
    activity: ['M10 2a5.9 5.9 0 0 1 5.98 5.36l.02.22v3.82l.92 2.22.06.17.01.08.01.13a1 1 0 0 1-.75.97l-.11.02L16 15h-3.5v.17a2.5 2.5 0 0 1-5 0V15H4l-.26-.03-.13-.04a1 1 0 0 1-.6-1.05l.02-.13.05-.13L4 11.4V7.57A5.9 5.9 0 0 1 10 2m1.5 13h-3v.15a1.5 1.5 0 0 0 1.36 1.34l.14.01c.78 0 1.42-.6 1.5-1.36zM10 3a4.9 4.9 0 0 0-4.98 4.38L5 7.6v3.9l-.04.2L4 14h12l-.96-2.3-.04-.2V7.61A4.9 4.9 0 0 0 10 3'] /* alert_20_regular */,
    chat: ['M10 2a8 8 0 1 1-3.61 15.14l-.12-.07-3.65.92a.5.5 0 0 1-.62-.45v-.08l.01-.08.92-3.64-.07-.12a8 8 0 0 1-.83-2.9l-.02-.37L2 10a8 8 0 0 1 8-8m0 1a7 7 0 0 0-6.1 10.42.5.5 0 0 1 .06.28l-.02.1-.75 3.01 3.02-.75.19-.01.09.02.09.04A7 7 0 1 0 10 3m.5 8a.5.5 0 0 1 .09 1H7.5a.5.5 0 0 1-.09-1h3.09m2-3a.5.5 0 0 1 .09 1H7.5a.5.5 0 0 1-.09-1h5.09'] /* chat_20_regular */,
    teams: ['M10 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M7.5 4.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0m8-.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m-10 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0m1-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m.6 12H5a2 2 0 0 1-2-2V9.25c0-.14.11-.25.25-.25h1.76q.06-.55.37-1H3.25C2.56 8 2 8.56 2 9.25V13a3 3 0 0 0 3.4 2.97 5 5 0 0 1-.3-.97m9.5.97q.2.03.4.03a3 3 0 0 0 3-3V9.25C18 8.56 17.44 8 16.75 8h-2.13q.3.45.37 1h1.76q.23.02.25.25V13a2 2 0 0 1-2.1 2q-.1.5-.3.97M7.25 8C6.56 8 6 8.56 6 9.25V14a4 4 0 0 0 8 0V9.25C14 8.56 13.44 8 12.75 8zM7 9.25c0-.14.11-.25.25-.25h5.5q.23.02.25.25V14a3 3 0 1 1-6 0z'] /* people_team_20_regular */,
    calendar: ['M7 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4-5.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5zM4 7h12v7.5c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5zm1.5-3h9c.83 0 1.5.67 1.5 1.5V6H4v-.5C4 4.67 4.67 4 5.5 4'] /* calendar_ltr_20_regular */,
    calls: ['m6.99 2.07-.72.21a3.5 3.5 0 0 0-2.45 2.86q-.44 3.1 1.96 7.25t5.3 5.33a3.5 3.5 0 0 0 3.7-.7l.55-.52a2 2 0 0 0 .25-2.62L14.22 12a1.5 1.5 0 0 0-1.65-.56l-2.05.63-.06.01c-.22.04-.74-.45-1.4-1.58-.67-1.18-.82-1.87-.63-2.04l1.05-.98a2.5 2.5 0 0 0 .57-2.85l-.66-1.47a2 2 0 0 0-2.4-1.1m1.49 1.5.66 1.47a1.5 1.5 0 0 1-.35 1.71l-1.04.98c-.67.63-.45 1.71.45 3.27.85 1.47 1.62 2.19 2.45 2.06l.12-.02 2.09-.64a.5.5 0 0 1 .55.19l1.36 1.88a1 1 0 0 1-.13 1.3l-.54.52a2.5 2.5 0 0 1-2.65.5q-2.55-1.01-4.8-4.9T4.81 5.28a2.5 2.5 0 0 1 1.75-2.04l.72-.22a1 1 0 0 1 1.2.55'] /* call_20_regular */,
    onedrive: ['M10 4c2.82 0 4.41 1.92 4.65 4.25h.07A3.33 3.33 0 0 1 18 11.62 3.33 3.33 0 0 1 14.72 15H5.28A3.33 3.33 0 0 1 2 11.62c0-1.8 1.37-3.27 3.1-3.37h.25C5.6 5.9 7.18 4 10 4m0 1C7.89 5 6.55 6.32 6.35 8.35a1 1 0 0 1-1 .9h-.07A2.33 2.33 0 0 0 3 11.62 2.33 2.33 0 0 0 5.28 14h9.44A2.33 2.33 0 0 0 17 11.62a2.33 2.33 0 0 0-2.28-2.37h-.07a1 1 0 0 1-1-.9C13.45 6.32 12.11 5 10 5'] /* cloud_20_regular */,
    apps: ['M4.5 17A1.5 1.5 0 0 1 3 15.65V4.5c0-.78.6-1.42 1.36-1.5H9c.78 0 1.42.6 1.5 1.36v.4l2.19-2.27a1.5 1.5 0 0 1 2-.14l.12.1 2.76 2.72c.55.55.6 1.42.11 2.02l-.1.11-2.31 2.2h.23c.78 0 1.42.6 1.5 1.36v4.64c0 .78-.6 1.42-1.36 1.5H4.5m5-6.5H4v5c0 .22.14.4.33.47l.08.02.09.01h5zm6 0h-5V16h5a.5.5 0 0 0 .5-.4V11a.5.5 0 0 0-.41-.5zm-5-2.79V9.5h1.79zM9 4.01H4.5a.5.5 0 0 0-.5.4v5.1h5.5v-5a.5.5 0 0 0-.33-.48l-.08-.02zm5.12-.84a.5.5 0 0 0-.64-.05l-.07.06-2.62 2.71a.5.5 0 0 0-.05.63l.06.07 2.61 2.62c.17.17.43.2.62.07l.08-.06 2.76-2.63a.5.5 0 0 0 .05-.64l-.05-.06z'] /* apps_20_regular */,
    more: ['M6.25 10a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M15 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5'] /* more_horizontal_20_regular */,
    search: ['M13.73 14.44a6.5 6.5 0 1 1 .7-.7l3.42 3.4a.5.5 0 0 1-.63.77l-.07-.06zm-.71-.71A5.5 5.5 0 0 0 15 9.5a5.5 5.5 0 1 0-1.98 4.23'] /* search_20_regular */,
    back: ['M12.35 15.85a.5.5 0 0 1-.7 0L6.16 10.4a.55.55 0 0 1 0-.78l5.49-5.46a.5.5 0 1 1 .7.7L7.2 10l5.16 5.15c.2.2.2.5 0 .7'] /* chevron_left_20_regular */,
    fwd: ['M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.47a.5.5 0 0 1-.7-.71L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7'] /* chevron_right_20_regular */,
    up: ['M3.13 9.16a.5.5 0 1 0 .74.68L9.5 3.67V17.5a.5.5 0 1 0 1 0V3.67l5.63 6.17a.5.5 0 0 0 .74-.68l-6.32-6.92a.75.75 0 0 0-1.1 0z'] /* arrow_up_20_regular */,
    refresh: ['M4 10a6 6 0 0 1 10.47-4H12.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.6a7 7 0 1 0 1.98 4.36.5.5 0 1 0-1 .08L16 10a6 6 0 0 1-12 0'] /* arrow_clockwise_20_regular */,
    video: ['M5 4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-.32l3.04 2.1c.83.57 1.96-.03 1.96-1.03v-7.5c0-1-1.13-1.6-1.96-1.03L13 7.32V7a3 3 0 0 0-3-3zm8 4.54 3.6-2.5c.17-.1.4.01.4.21v7.5c0 .2-.23.32-.4.2L13 11.46zM3 7c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'] /* video_20_regular */,
    info: ['M10.5 8.91a.5.5 0 0 0-1 .09v4.6a.5.5 0 0 0 1-.1V8.91m.3-2.16a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0'] /* info_20_regular */,
    reply: ['M7.35 3.65c.2.2.2.5 0 .7L3.71 8h6.79a7.5 7.5 0 0 1 7.5 7.5.5.5 0 0 1-1 0A6.5 6.5 0 0 0 10.5 9H3.7l3.65 3.65a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5c.2-.2.5-.2.7 0'] /* arrow_reply_20_regular */,
    smile: ['M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0m10.5-1.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-5 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-1.61 4.01a.5.5 0 1 0-.78.63 5 5 0 0 0 7.78 0 .5.5 0 1 0-.78-.63 4 4 0 0 1-6.22 0'] /* emoji_20_regular */,
    edit: ['M17.18 2.93a2.97 2.97 0 0 0-4.26-.06l-9.37 9.38q-.5.5-.66 1.2l-.88 3.94a.5.5 0 0 0 .6.6l3.93-.87c.46-.1.9-.34 1.23-.68l9.36-9.36a2.97 2.97 0 0 0 .05-4.15m-3.55.65a1.97 1.97 0 1 1 2.8 2.8l-.68.66-2.8-2.79zm-1.38 1.38 2.8 2.8-7.99 7.97q-.31.31-.74.41l-3.16.7.7-3.18q.1-.41.4-.7z'] /* edit_20_regular */,
    plus: ['M10 2.5c.28 0 .5.22.5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3c0-.28.22-.5.5-.5'] /* add_20_regular */,
    upload: ['M15 3a.5.5 0 0 0 .09-.99H4a.5.5 0 0 0-.09.98L4 3zM9.5 18a.5.5 0 0 0 .5-.41V5.7l3.64 3.65c.17.18.44.2.64.06l.07-.06a.5.5 0 0 0 .06-.63l-.06-.07-4.5-4.5A.5.5 0 0 0 9.6 4h-.1a.5.5 0 0 0-.4.19L4.64 8.65a.5.5 0 0 0 .64.76l.07-.06L9 5.71V17.5c0 .28.22.5.5.5'] /* arrow_upload_20_regular */,
    share: ['M9.5 3a.5.5 0 0 1 0 1H6a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1.5a.5.5 0 0 1 1 0V14a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm3.8-.96a.5.5 0 0 1 .53.09l5 4.5a.5.5 0 0 1 0 .74l-5 4.5a.5.5 0 0 1-.83-.37V9.34c-1.4.13-2.67.78-3.7 1.6a10 10 0 0 0-2.2 2.5l-.15.28A.5.5 0 0 1 6 13.5c0-2.05.38-4.28 1.52-6.02A6.6 6.6 0 0 1 13 4.5V2.43a.5.5 0 0 1 .3-.39M14 5a.5.5 0 0 1-.5.5c-2.59 0-4.18 1.05-5.14 2.52a9 9 0 0 0-1.25 3.69 11 11 0 0 1 1.56-1.54 7.8 7.8 0 0 1 4.83-1.85c.28 0 .5.22.5.5v1.56L17.75 7 14 3.62z'] /* share_20_regular */,
    link: ['M8 6a.5.5 0 0 1 .09 1H6a3 3 0 0 0-.2 6H8a.5.5 0 0 1 .09 1H6a4 4 0 0 1-.22-8H8m6 0a4 4 0 0 1 .22 8H12a.5.5 0 0 1-.09-1H14a3 3 0 0 0 .2-6H12a.5.5 0 0 1-.09-1H14M6 9.5h8a.5.5 0 0 1 .09 1H6a.5.5 0 0 1-.09-1zh8z'] /* link_20_regular */,
    sync: ['M11.41 3.64a.5.5 0 0 0 0-.71L9.3.8a.5.5 0 0 0-.7.7l1 1a7.5 7.5 0 0 0-4.08 13.5.5.5 0 0 0 .6-.8A6.5 6.5 0 0 1 10.14 3.5L8.59 5.04a.5.5 0 0 0 .7.7zM8.6 16.36a.5.5 0 0 0 0 .71l2.12 2.12a.5.5 0 0 0 .7-.7l-1-1a7.5 7.5 0 0 0 4.07-13.5.5.5 0 1 0-.59.8q.37.28.7.61a6.5 6.5 0 0 1-4.73 11.1l1.55-1.55a.5.5 0 1 0-.7-.7z'] /* arrow_sync_20_regular */,
    download: ['M15.5 17a.5.5 0 0 1 .09 1H4.5a.5.5 0 0 1-.09-1H15.5M10 2a.5.5 0 0 1 .5.41V14.3l3.64-3.65a.5.5 0 0 1 .64-.06l.07.06c.17.17.2.44.06.63l-.06.07-4.5 4.5a.5.5 0 0 1-.25.14L10 16a.5.5 0 0 1-.4-.2l-4.46-4.45a.5.5 0 0 1 .64-.76l.07.06 3.65 3.64V2.5c0-.27.22-.5.5-.5'] /* arrow_download_20_regular */,
    filter: ['M7.5 13h5a.5.5 0 0 1 .09 1H7.5a.5.5 0 0 1-.09-1zh5zm-2-4h9a.5.5 0 0 1 .09 1H5.5a.5.5 0 0 1-.09-1zh9zm-2-4h13a.5.5 0 0 1 .09 1H3.5a.5.5 0 0 1-.09-1zh13z'] /* filter_20_regular */,
    chevron: ['M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.47a.5.5 0 0 1-.7-.71L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7'] /* chevron_right_20_regular */,
    chevd: ['M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0'] /* chevron_down_20_regular */,
    mail: ['M15.5 4A2.5 2.5 0 0 1 18 6.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 14.5v-8A2.5 2.5 0 0 1 4.5 4zM17 7.96l-6.75 3.97a.5.5 0 0 1-.42.04l-.08-.04L3 7.96v6.54c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5zM15.5 5h-11C3.67 5 3 5.67 3 6.5v.3l7 4.12 7-4.12v-.3c0-.83-.67-1.5-1.5-1.5'] /* mail_20_regular */,
    people: ['M4.5 6.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0M6.75 3.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5m5.69 11.65q.79.33 2.06.35c1.88 0 2.92-.67 3.47-1.43a3 3 0 0 0 .53-1.5v-.07c0-.83-.67-1.5-1.5-1.5h-4.63q.36.44.53 1H17c.28 0 .5.22.5.5v.1l-.04.22q-.05.29-.3.66c-.33.46-1.04 1.02-2.66 1.02q-1.08-.01-1.69-.28-.12.43-.37.93M1.5 13c0-1.1.9-2 2-2H10a2 2 0 0 1 2 2v.08l-.01.18q-.01.17-.08.45c-.08.37-.25.86-.6 1.36-.7 1.01-2.05 1.93-4.56 1.93s-3.87-.92-4.57-1.93a4 4 0 0 1-.68-1.99V13m1 .06v.1l.06.33c.07.27.2.64.45 1C3.49 15.2 4.5 16 6.75 16s3.26-.8 3.74-1.5a3 3 0 0 0 .5-1.42l.01-.02V13a1 1 0 0 0-1-1H3.5a1 1 0 0 0-1 1zM13 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M14.5 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5'] /* people_20_regular */,
    clip: ['m4.83 10.48 5.65-5.65a3 3 0 0 1 4.25 4.24L8 15.8a1.5 1.5 0 0 1-2.12-2.12l6-6.01a.5.5 0 1 0-.7-.71l-6 6.01a2.5 2.5 0 0 0 3.53 3.54l6.71-6.72a4 4 0 1 0-5.65-5.66L4.12 9.78a.5.5 0 0 0 .7.7'] /* attach_20_regular */,
    inbox: ['M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm10 7h-3.5a.5.5 0 0 0-.5.5v.01l-.03.3q-.05.31-.23.72-.18.39-.57.66-.37.29-1.17.31c-.54 0-.9-.13-1.17-.3a2 2 0 0 1-.57-.67A3 3 0 0 1 8 10.5v-.01a.5.5 0 0 0-.5-.5H4V6c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2zM4 11h3.05c.05.26.14.62.32.97q.26.59.9 1.06.67.45 1.73.47 1.06-.02 1.72-.47.65-.47.91-1.06c.18-.35.27-.7.32-.97H16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'] /* mail_inbox_20_regular */,
    send: ['M2.18 2.11a.5.5 0 0 1 .54-.06l15 7.5a.5.5 0 0 1 0 .9l-15 7.5a.5.5 0 0 1-.7-.58L3.98 10 2.02 2.63a.5.5 0 0 1 .16-.52m2.7 8.39-1.61 6.06L16.38 10 3.27 3.44 4.88 9.5h6.62a.5.5 0 1 1 0 1z'] /* send_20_regular */,
    draft: ['m13.25 2.82-9.61 9.6-.12.13a2 2 0 0 0-.4.76l-1.1 4.06-.02.08a.5.5 0 0 0 .63.53l4.06-1.1.16-.06a2 2 0 0 0 .73-.46l9.6-9.6.13-.15a2.78 2.78 0 0 0-4.06-3.8m-8.9 10.31 8.04-8.04 2.52 2.52-8.04 8.04-.1.09-.1.07-.25.1-3.2.87.87-3.2.04-.13a1 1 0 0 1 .22-.32m12.12-9.6.11.11c.59.7.55 1.75-.1 2.4l-.87.87-2.52-2.53.86-.86.12-.1c.7-.59 1.75-.55 2.4.1M11.65 3H2.5a.5.5 0 0 0 0 1h8.15zm-3 3H2.5a.5.5 0 0 0 0 1h5.15zm-4 4 1-1H2.5a.5.5 0 0 0 0 1z'] /* drafts_20_regular */,
    trash: ['M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.05l-1.2 10.34A3 3 0 0 1 12.27 18H7.73a3 3 0 0 1-2.98-2.66L3.55 5H2.5a.5.5 0 0 1 0-1zM5.74 15.23A2 2 0 0 0 7.73 17h4.54a2 2 0 0 0 1.99-1.77L15.44 5H4.56zM8.5 7.5c.28 0 .5.22.5.5v6a.5.5 0 0 1-1 0V8c0-.28.22-.5.5-.5M12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z'] /* delete_20_regular */,
    home: ['M9 2.39a1.5 1.5 0 0 1 2 0l5.5 4.94c.32.28.5.69.5 1.12v7.05c0 .83-.67 1.5-1.5 1.5H13a1.5 1.5 0 0 1-1.5-1.5V12a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v3.5c0 .83-.67 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 15.5V8.45c0-.43.18-.84.5-1.12zm1.33.74a.5.5 0 0 0-.66 0l-5.5 4.94a.5.5 0 0 0-.17.38v7.05c0 .28.22.5.5.5H7a.5.5 0 0 0 .5-.5V12c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v3.5c0 .28.22.5.5.5h2.5a.5.5 0 0 0 .5-.5V8.45a.5.5 0 0 0-.17-.38z'] /* home_20_regular */,
    star: ['M9.1 2.9a1 1 0 0 1 1.8 0l1.93 3.91 4.31.63a1 1 0 0 1 .56 1.7l-3.12 3.05.73 4.3a1 1 0 0 1-1.45 1.05L10 15.51l-3.86 2.03a1 1 0 0 1-1.45-1.05l.74-4.3L2.3 9.14a1 1 0 0 1 .56-1.7l4.31-.63zm.9.44L8.07 7.25a1 1 0 0 1-.75.55L3 8.43l3.12 3.04a1 1 0 0 1 .3.89l-.75 4.3 3.87-2.03a1 1 0 0 1 .93 0l3.86 2.03-.74-4.3a1 1 0 0 1 .29-.89L17 8.43l-4.32-.63a1 1 0 0 1-.75-.55z'] /* star_20_regular */,
    pc: ['M4 2a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h3v2H5.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1H13v-2h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm8 13v2H8v-2zM3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z'] /* desktop_20_regular */,
    pic: ['M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v8q0 .56.28 1.02l4.67-4.59a1.5 1.5 0 0 1 2.1 0l4.67 4.59Q16 14.56 16 14V6a2 2 0 0 0-2-2zm0 12h8a2 2 0 0 0 1.01-.27l-4.66-4.58a.5.5 0 0 0-.7 0l-4.66 4.58A2 2 0 0 0 6 16'] /* image_20_regular */,
    cut: ['M5.92 2.23a.5.5 0 0 0-.84.54L9.4 9.43l-1.92 2.96a3 3 0 1 0 .78.64L10 10.35l1.74 2.68a3 3 0 1 0 .78-.64zM14 17a2 2 0 1 1 0-4 2 2 0 0 1 0 4M4 15a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7.2-6.49-.6-.92 3.48-5.36a.5.5 0 0 1 .84.54z'] /* cut_20_regular */,
    copy: ['M7 7H5.5C4.67 7 4 7.67 4 8.5v6c0 .83.67 1.5 1.5 1.5h4c.65 0 1.2-.42 1.41-1h1.04a2.5 2.5 0 0 1-2.45 2h-4A2.5 2.5 0 0 1 3 14.5v-6A2.5 2.5 0 0 1 5.5 6H7zm7.5-4A2.5 2.5 0 0 1 17 5.5v6a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 8 11.5v-6A2.5 2.5 0 0 1 10.5 3zm-4 1C9.67 4 9 4.67 9 5.5v6c0 .83.67 1.5 1.5 1.5h4c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5z'] /* copy_20_regular */,
    paste: ['M4.5 4h1.59c.2.58.76 1 1.41 1h3c.65 0 1.2-.42 1.41-1h1.59c.28 0 .5.22.5.5v1a.5.5 0 0 0 1 0v-1c0-.83-.67-1.5-1.5-1.5h-1.59c-.2-.58-.76-1-1.41-1h-3c-.65 0-1.2.42-1.41 1H4.5C3.67 3 3 3.67 3 4.5v12c0 .83.67 1.5 1.5 1.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 1-.5-.5v-12c0-.28.22-.5.5-.5m3 0a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm3 3C9.67 7 9 7.67 9 8.5v8c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5zM10 8.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z'] /* clipboard_paste_20_regular */,
    sort: ['M2.35 7.35 5 4.71V16.5a.5.5 0 0 0 1 0V4.7l2.65 2.65a.5.5 0 0 0 .7-.7l-3.49-3.5A.5.5 0 0 0 5.5 3a.5.5 0 0 0-.39.18L1.65 6.65a.5.5 0 1 0 .7.7m15.3 5.3L15 15.29V3.5a.5.5 0 0 0-1 0v11.8l-2.65-2.65a.5.5 0 0 0-.7.7l3.49 3.5a.5.5 0 0 0 .36.15.5.5 0 0 0 .39-.18l3.46-3.47a.5.5 0 1 0-.7-.7'] /* arrow_sort_20_regular */,
    view: ['M2 4.5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m0 5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m.5 4.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z'] /* text_align_justify_20_regular */,
    check: ['M3.37 10.17a.5.5 0 0 0-.74.66l4 4.5c.19.22.52.23.72.02l10.5-10.5a.5.5 0 0 0-.7-.7L7.02 14.27z'] /* checkmark_20_regular */,
    waffle: ['M4.25 14.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M4.25 8.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M4.25 3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M10 3a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 10 3m5.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5'] /* grid_dots_20_regular */,
    gear: ['M1.91 7.38A8.5 8.5 0 0 1 3.7 4.3a.5.5 0 0 1 .54-.13l1.92.68a1 1 0 0 0 1.32-.76l.36-2a.5.5 0 0 1 .4-.4 9 9 0 0 1 3.55 0q.32.08.38.4l.37 2a1 1 0 0 0 1.32.76l1.92-.68a.5.5 0 0 1 .54.13 8.5 8.5 0 0 1 1.78 3.08q.08.31-.15.54l-1.56 1.32a1 1 0 0 0 0 1.52l1.56 1.32a.5.5 0 0 1 .15.54 8.5 8.5 0 0 1-1.78 3.08.5.5 0 0 1-.54.13l-1.92-.68a1 1 0 0 0-1.32.76l-.37 2a.5.5 0 0 1-.38.4 8.5 8.5 0 0 1-3.56 0 .5.5 0 0 1-.39-.4l-.36-2a1 1 0 0 0-1.32-.76l-1.92.68a.5.5 0 0 1-.54-.13 8.5 8.5 0 0 1-1.78-3.08.5.5 0 0 1 .15-.54l1.56-1.32a1 1 0 0 0 0-1.52L2.06 7.92a.5.5 0 0 1-.15-.54m1.06 0 1.3 1.1a2 2 0 0 1 0 3.04l-1.3 1.1q.45 1.19 1.25 2.16l1.6-.58a2 2 0 0 1 2.63 1.53l.3 1.67a8 8 0 0 0 2.5 0l.3-1.67a2 2 0 0 1 2.64-1.53l1.6.58a8 8 0 0 0 1.24-2.16l-1.3-1.1a2 2 0 0 1 0-3.04l1.3-1.1a8 8 0 0 0-1.25-2.16l-1.6.58a2 2 0 0 1-2.63-1.53l-.3-1.67a8 8 0 0 0-2.5 0l-.3 1.67A2 2 0 0 1 5.81 5.8l-1.6-.58a8 8 0 0 0-1.24 2.16M7.5 10a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0m1 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0'] /* settings_20_regular */,
    bell: ['M10 2a5.9 5.9 0 0 1 5.98 5.36l.02.22v3.82l.92 2.22.06.17.01.08.01.13a1 1 0 0 1-.75.97l-.11.02L16 15h-3.5v.17a2.5 2.5 0 0 1-5 0V15H4l-.26-.03-.13-.04a1 1 0 0 1-.6-1.05l.02-.13.05-.13L4 11.4V7.57A5.9 5.9 0 0 1 10 2m1.5 13h-3v.15a1.5 1.5 0 0 0 1.36 1.34l.14.01c.78 0 1.42-.6 1.5-1.36zM10 3a4.9 4.9 0 0 0-4.98 4.38L5 7.6v3.9l-.04.2L4 14h12l-.96-2.3-.04-.2V7.61A4.9 4.9 0 0 0 10 3'] /* alert_20_regular */,
    window: ['M3 10c0-.28.22-.5.5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 3 10'] /* subtract_20_regular */,
    max: ['M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z'] /* square_20_regular */,
    close: ['m4.09 4.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07z'] /* dismiss_20_regular */,
    lock: ['M10 1a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v6a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 15.5v-6c0-1.2.86-2.22 2-2.45V5a4 4 0 0 1 4-4M6.5 8C5.67 8 5 8.67 5 9.5v6c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm3.5 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2M10 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3'] /* lock_closed_20_regular */,
    sun: ['M10 2c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6m7.5-2.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM10 16c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m-6.5-5.5a.5.5 0 0 0 0-1H2.46a.5.5 0 0 0 0 1zm.65-6.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 11.7a.5.5 0 0 1-.7-.7l1-1a.5.5 0 0 1 .7.7zm11-11.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 11.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z'] /* weather_sunny_20_regular */,
    flag: ['M5 13h11.5a.5.5 0 0 0 .42-.78L14.1 8l2.82-4.22A.5.5 0 0 0 16.5 3h-12a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 1 0zm0-1V4h10.57l-2.49 3.72a.5.5 0 0 0 0 .56L15.57 12z'] /* flag_20_regular */,
    sparkle: ['M7.4 12.8a1.04 1.04 0 0 0 1.59-.51l.45-1.37a2.3 2.3 0 0 1 1.47-1.48l1.4-.45A1.04 1.04 0 0 0 12.25 7l-1.37-.45A2.3 2.3 0 0 1 9.4 5.08L8.95 3.7a1 1 0 0 0-.82-.68 1.04 1.04 0 0 0-1.15.7l-.46 1.4a2.3 2.3 0 0 1-1.44 1.45L3.7 7a1.04 1.04 0 0 0 .02 1.97l1.37.45a2.3 2.3 0 0 1 1.48 1.48l.46 1.4q.1.3.38.5m.08-7.4.53-1.38.44 1.37a3.3 3.3 0 0 0 2.12 2.12l1.4.53-1.38.45a3.3 3.3 0 0 0-2.11 2.11l-.53 1.38-.45-1.38a3.3 3.3 0 0 0-2.1-2.12L4 7.96 5.4 7.5a3.4 3.4 0 0 0 2.08-2.12m6.06 11.45a.8.8 0 0 0 1.22-.4l.25-.76a1.1 1.1 0 0 1 .68-.68l.77-.25a.8.8 0 0 0-.02-1.52l-.77-.25a1.1 1.1 0 0 1-.68-.68l-.25-.77a.8.8 0 0 0-1.52.01l-.24.76a1.1 1.1 0 0 1-.67.68l-.77.25a.8.8 0 0 0 0 1.52l.77.25a1.1 1.1 0 0 1 .68.68l.25.77q.09.25.3.4m-.92-2.8-.18-.05.19-.06a2.1 2.1 0 0 0 1.3-1.32l.06-.18.05.18a2 2 0 0 0 1.32 1.32l.2.06-.18.06a2 2 0 0 0-1.32 1.32l-.06.18-.06-.18a2 2 0 0 0-1.32-1.32'] /* sparkle_20_regular */,
    listcheck: ['M5.85 4.35a.5.5 0 1 0-.7-.7L3.5 5.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0zM8.5 5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM8 15.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.85 9.85a.5.5 0 1 0-.7-.7L3.5 10.79l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0zm0 4.3c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 1.65-1.64c.2-.2.5-.2.7 0'] /* task_list_ltr_20_regular */,
    board: ['M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v1.06L9.5 7V4zm4.5 0v8H16V6a2 2 0 0 0-2-2zm5.5 9h-5.5v3H14a2 2 0 0 0 2-2zm-6.5 3V8L4 8.06V14c0 1.1.9 2 2 2z'] /* board_20_regular */,
    clock: ['M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16m0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-.5 2a.5.5 0 0 1 .5.41V10h2.5a.5.5 0 0 1 .09 1H9.5a.5.5 0 0 1-.5-.41V5.5c0-.28.22-.5.5-.5'] /* clock_20_regular */,
    comment: ['M10.48 13.84h4.92c.9 0 1.6-.71 1.6-1.56V5.57C17 4.7 16.3 4 15.4 4H4.6C3.7 4 3 4.71 3 5.57v6.7c0 .86.7 1.57 1.6 1.57h1.6V17zM6.8 17.8a1 1 0 0 1-1.4-.2 1 1 0 0 1-.2-.59v-2.17h-.6A2.6 2.6 0 0 1 2 12.28V5.57A2.6 2.6 0 0 1 4.6 3h10.8C16.84 3 18 4.15 18 5.57v6.7a2.6 2.6 0 0 1-2.6 2.57h-4.59z'] /* comment_20_regular */,
    attach: ['m4.83 10.48 5.65-5.65a3 3 0 0 1 4.25 4.24L8 15.8a1.5 1.5 0 0 1-2.12-2.12l6-6.01a.5.5 0 1 0-.7-.71l-6 6.01a2.5 2.5 0 0 0 3.53 3.54l6.71-6.72a4 4 0 1 0-5.65-5.66L4.12 9.78a.5.5 0 0 0 .7.7'] /* attach_20_regular */,
    x: ['m4.09 4.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07z'] /* dismiss_20_regular */
  };
  var PF = {
    activity: ['M12.45 16a2.5 2.5 0 0 1-4.9 0zM10 2a5.9 5.9 0 0 1 5.98 5.36l.02.22v3.82l.95 2.6.03.08.01.09v.08c0 .32-.19.6-.51.71l-.12.03-.11.01H3.75a.75.75 0 0 1-.74-.76v-.12l.04-.12L4 11.4V7.57A5.9 5.9 0 0 1 10 2'] /* alert_20_filled */,
    chat: ['M10 2a8 8 0 1 1-3.61 15.14l-.12-.07-3.65.92a.5.5 0 0 1-.62-.45v-.08l.01-.08.92-3.64-.07-.12a8 8 0 0 1-.83-2.9l-.02-.37L2 10a8 8 0 0 1 8-8m.5 9H7.41a.5.5 0 0 0 0 1h3.18a.5.5 0 0 0 0-1zm2-3H7.41a.5.5 0 0 0 0 1h5.18a.5.5 0 0 0 0-1z'] /* chat_20_filled */,
    teams: ['M12.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m5 .5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-13 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 9.25C6 8.56 6.56 8 7.25 8h5.5c.69 0 1.25.56 1.25 1.25V14a4 4 0 0 1-8 0zm-1 0q.01-.7.38-1.25H3.25C2.56 8 2 8.56 2 9.25V13a3 3 0 0 0 3.4 2.97Q5 15.06 5 14zM15 14q0 1.06-.4 1.97.2.03.4.03a3 3 0 0 0 3-3V9.25C18 8.56 17.44 8 16.75 8h-2.13q.37.55.38 1.25z'] /* people_team_20_filled */,
    calendar: ['M5.5 3A2.5 2.5 0 0 0 3 5.5V6h14v-.5A2.5 2.5 0 0 0 14.5 3zM17 7H3v7.5A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5zm-9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2m4-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0'] /* calendar_ltr_20_filled */,
    calls: ['M6.99 2.07A2 2 0 0 1 9.3 3l.08.15.66 1.47a2.5 2.5 0 0 1-.44 2.72l-.13.13-1.05.98c-.19.17-.04.86.64 2.04.6 1.06 1.1 1.56 1.35 1.58h.1l2.05-.64a1.5 1.5 0 0 1 1.56.45l.1.11 1.35 1.88a2 2 0 0 1-.13 2.5l-.12.12-.54.52a3.5 3.5 0 0 1-3.72.7q-2.9-1.17-5.29-5.33T3.82 5.14a3.5 3.5 0 0 1 2.26-2.8l.19-.06z'] /* call_20_filled */,
    onedrive: ['M10 4c2.82 0 4.41 1.92 4.65 4.25h.07A3.33 3.33 0 0 1 18 11.62 3.33 3.33 0 0 1 14.72 15H5.28A3.33 3.33 0 0 1 2 11.62a3.33 3.33 0 0 1 3.28-3.37h.07C5.6 5.9 7.18 4 10 4'] /* cloud_20_filled */,
    apps: ['M4.5 17A1.5 1.5 0 0 1 3 15.65V4.5c0-.78.6-1.42 1.36-1.5H9c.78 0 1.42.6 1.5 1.36v.4l2.19-2.27a1.5 1.5 0 0 1 2-.14l.12.1 2.76 2.72c.55.55.6 1.42.11 2.02l-.1.11-2.31 2.2h.23c.78 0 1.42.6 1.5 1.36v4.64c0 .78-.6 1.42-1.36 1.5H4.5m5-6.5H4v5c0 .22.14.4.33.47l.08.02.09.01h5zm6 0h-5V16h5a.5.5 0 0 0 .5-.4V11a.5.5 0 0 0-.41-.5zm-5-2.79V9.5h1.79zM9 4.01H4.5a.5.5 0 0 0-.5.4v5.1h5.5v-5a.5.5 0 0 0-.33-.48l-.08-.02z'] /* apps_20_filled */,
    mail: ['M18 7.37v7.13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 14.5V7.37l7.75 4.56c.15.1.35.1.5 0zM15.5 4a2.5 2.5 0 0 1 2.48 2.22L10 10.92l-7.98-4.7A2.5 2.5 0 0 1 4.5 4z'] /* mail_20_filled */,
    people: ['M6.75 10a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5m5.69 5.14q.78.35 2.06.36c4 0 4-3 4-3 0-.83-.67-1.5-1.5-1.5h-4.63q.62.74.63 1.75v.36l-.02.25a5 5 0 0 1-.54 1.78M17 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0M1.5 13c0-1.1.9-2 2-2H10a2 2 0 0 1 2 2s0 4-5.25 4-5.25-4-5.25-4m11.5.1v.07Z'] /* people_20_filled */,
    listcheck: ['M5.85 4.35a.5.5 0 1 0-.7-.7L3.5 5.29l-.65-.64a.5.5 0 1 0-.7.7l1 1c.2.2.5.2.7 0zm2.9.15a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM8 15.25c0-.41.34-.75.75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75m-2.15-5.4a.5.5 0 1 0-.7-.7L3.5 10.79l-.65-.64a.5.5 0 0 0-.7.7l1 1c.2.2.5.2.7 0zm0 4.3c.2.2.2.5 0 .7l-2 2a.5.5 0 0 1-.7 0l-1-1a.5.5 0 0 1 .7-.7l.65.64 1.65-1.64c.2-.2.5-.2.7 0'] /* task_list_ltr_20_filled */,
    board: ['M9.5 3v4H3V6a3 3 0 0 1 3-3zm1 0v9H17V6a3 3 0 0 0-3-3zM17 13h-6.5v4H14a3 3 0 0 0 3-3zm-7.5 4V8H3v6a3 3 0 0 0 3 3z'] /* board_20_filled */,
    home: ['M11 2.39a1.5 1.5 0 0 0-2 0L3.5 7.33c-.32.28-.5.69-.5 1.12v7.05c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5v-4c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v4c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5V8.45c0-.43-.18-.84-.5-1.12z'] /* home_20_filled */,
    check: ['M7.03 13.9 3.56 10a.75.75 0 0 0-1.12 1l4 4.5c.29.32.79.34 1.09.03l10.5-10.5a.75.75 0 0 0-1.06-1.06z'] /* checkmark_20_filled */,
    x: ['m3.9 4.05.07-.08a.75.75 0 0 1 .98-.07l.08.07L10 8.94l4.97-4.97a.75.75 0 0 1 .98-.07l.08.07c.27.27.3.68.07.98l-.07.08L11.06 10l4.97 4.97c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L10 11.06l-4.97 4.97a.75.75 0 0 1-.98.07l-.08-.07a.75.75 0 0 1-.07-.98l.07-.08L8.94 10 3.97 5.03a.75.75 0 0 1-.07-.98l.07-.08z'] /* dismiss_20_filled */
  };
  function fi(n, cls, filled) {
    var d = (filled && PF[n]) || P[n];
    return '<svg class="fi' + (cls ? ' ' + cls : '') + '" viewBox="0 0 20 20" aria-hidden="true">' + d.map(function (x) { return '<path d="' + x + '" fill="currentColor"/>'; }).join('') + '</svg>';
  }
  /* Office-style file type glyphs: coloured tile with letter, folder in yellow. */
  function ftype(name, kind) {
    var ext = /\.([a-z0-9]+)$/i.exec(name || ''), e = ext ? ext[1].toLowerCase() : '';
    if (kind === 'folder' || /\/$/.test(name || '')) return '<span class="ft ft-folder" aria-hidden="true"></span>';
    var k = e === 'xlsx' || kind === 'table' ? 'x' : e === 'pptx' ? 'p' : e === 'pdf' ? 'pdf' : 'w';
    return '<span class="ft ft-' + k + '" aria-hidden="true"><b>' + (k === 'x' ? 'X' : k === 'p' ? 'P' : k === 'pdf' ? 'PDF' : 'W') + '</b></span>';
  }
  function avatar(p, size) {
    return '<span class="m-av m-av-' + (typeof p.idx === 'number' ? p.idx % 6 : 0) + '" style="--s:' + (size || 32) + 'px" aria-hidden="true">' + esc(initials(p.name)) + '</span>';
  }
  function mk(n, on) { return n && on ? '<span class="m-mk" aria-label="Hinweis ' + n + '">' + n + '</span>' : ''; }
  function nl2br(t) { return esc(t).replace(/\n/g, '<br>'); }
  function frame(cls, label, inner) {
    return '<div class="m3 ' + cls + '" role="img" aria-label="' + esc(label) + '" style="width:' + W + 'px;height:' + H + 'px">' + inner + '</div>';
  }
  function fileExt(n) { var m = /\.([a-z0-9]+)$/i.exec(n || ''); return m ? m[1].toLowerCase() : ''; }
  function typeName(n) { return { xlsx: 'Microsoft Excel-Arbeitsblatt', docx: 'Microsoft Word-Dokument', pptx: 'Microsoft PowerPoint-Präsentation', pdf: 'PDF-Dokument' }[fileExt(n)] || 'Datei'; }

  /* ================= Teams ================= */
  function teams(vm, o) {
    o = o || {};
    var sc = vm.scene;
    var tab = o.tab || 'posts';
    var tabs = [['posts', 'Beiträge', sc.posts.length], ['files', 'Dateien', sc.files.length], ['tasks', 'Aufgaben', sc.tasks.length]].filter(function (t) { return t[2] > 0; });
    if (!tabs.some(function (t) { return t[0] === tab; })) tab = tabs[0][0];
    var me = vm.person(vm.story ? vm.story.viewer : sc.members[0]);
    var members = sc.members.map(vm.person);
    /* Member pane only when the teaching point is about who belongs (guests/externals). */
    var showMembers = members.some(function (p) { return p.external; });
    var rail = teamsRail('teams');
    var body = tab === 'files' ? teamsFiles(vm, o) : tab === 'tasks' ? teamsTasks(vm, o) : teamsPosts(vm, o);
    var tile = '<span class="t-tile t-tile-' + (vm.world.id.length % 5) + '" aria-hidden="true">' + esc(initials(vm.team)) + '</span>';
    return frame('m3-teams' + (o.annot ? ' annot' : ''), 'Microsoft Teams, nachgebildet: ' + vm.team + ', Kanal ' + sc.active,
      '<div class="t-title">' +
        '<span class="t-nav">' + fi('back') + fi('fwd') + '</span>' +
        '<span class="t-search">' + fi('search') + '<span>Suchen</span></span>' +
        '<span class="t-acct">' + fi('more') + '<span class="t-me">' + avatar(me, 28) + '<i class="t-pres"></i></span></span>' +
      '</div>' +
      '<nav class="t-rail" aria-hidden="true">' + rail.map(function (r) {
        return '<span class="t-ri' + (r[2] ? ' on' : '') + '">' + fi(r[0], null, r[2]) + '<small>' + r[1] + '</small></span>';
      }).join('') + '<span class="t-ri">' + fi('more') + '</span><span class="t-ri t-ri-b">' + fi('apps') + '<small>Apps</small></span></nav>' +
      '<aside class="t-list">' +
        '<div class="t-lh"><strong>Teams</strong><span>' + fi('filter') + fi('more') + fi('plus') + '</span></div>' +
        '<p class="t-sec">' + fi('chevd') + 'Teams und Kanäle</p>' +
        '<div class="t-team">' + fi('chevd', 't-chev') + tile + '<span><strong data-bind="team">' + esc(vm.team) + '</strong></span>' + fi('more', 't-dim') + '</div>' +
        '<ul class="t-chans">' + sc.channels.map(function (c) {
          return '<li class="' + (c === sc.active ? 'on' : '') + '"' + (c === sc.active ? ' aria-current="true"' : '') + '>' + esc(c) + '</li>';
        }).join('') + '</ul>' +
        '<p class="t-all">Alle Ihre Teams und Kanäle anzeigen</p>' +
      '</aside>' +
      '<section class="t-main">' +
        '<header class="t-ch">' + tile.replace('t-tile', 't-tile t-tile-l') +
          '<div class="t-chn"><p><strong># ' + esc(sc.active) + '</strong><small>' + esc(vm.team) + '</small></p>' +
          '<div class="t-tabs" role="tablist" aria-label="Ansicht im Kanal">' + tabs.map(function (t) {
            return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === tab) + '"' + (t[0] === tab ? '' : ' tabindex="-1"') + '>' + t[1] + '</button>';
          }).join('') + '<span class="t-tabplus">' + fi('plus') + '</span></div></div>' +
          '<div class="t-cha"><span class="t-face">' + members.slice(0, 3).map(function (p) { return avatar(p, 24); }).join('') + '<small>' + members.length + '</small></span>' +
            '<span class="t-meet">' + fi('video') + 'Besprechen' + fi('chevd') + '</span>' + fi('info', 't-dim') + fi('more', 't-dim') + '</div>' +
        '</header>' +
        '<div class="t-body' + (showMembers ? ' t-body-m' : '') + '"><div class="t-content" role="tabpanel">' + body + '</div>' +
          (showMembers ? '<aside class="t-mem"><p class="t-memh">Mitglieder und Gäste · ' + members.length + '</p><ul class="t-memlist">' + members.map(function (p) {
            return '<li>' + avatar(p, 28) + '<span>' + esc(short(p.name)) + (p.external ? ' <em>extern</em>' : p.outside ? ' <em>andere Einheit</em>' : '') + '</span></li>';
          }).join('') + '</ul></aside>' : '') +
        '</div>' +
      '</section>');
  }

  function teamsRail(on) {
    return [['activity', 'Aktivität'], ['chat', 'Chat'], ['teams', 'Teams'], ['calendar', 'Kalender'], ['calls', 'Anrufe'], ['onedrive', 'OneDrive']].map(function (r) { return [r[0], r[1], r[0] === on ? 1 : 0]; });
  }
  /* Shared Teams chrome (title bar + rail) for chat and meeting screens. */
  function teamsChrome(me, on) {
    return '<div class="t-title"><span class="t-nav">' + fi('back') + fi('fwd') + '</span><span class="t-search">' + fi('search') + '<span>Suchen</span></span>' +
      '<span class="t-acct">' + fi('more') + '<span class="t-me">' + avatar(me, 28) + '<i class="t-pres"></i></span></span></div>' +
      '<nav class="t-rail" aria-hidden="true">' + teamsRail(on).map(function (r) {
        return '<span class="t-ri' + (r[2] ? ' on' : '') + '">' + fi(r[0], null, r[2]) + '<small>' + r[1] + '</small></span>';
      }).join('') + '<span class="t-ri">' + fi('more') + '</span><span class="t-ri t-ri-b">' + fi('apps') + '<small>Apps</small></span></nav>';
  }

  function teamsPosts(vm, o) {
    var list = vm.scene.posts;
    return '<ol class="t-posts">' + list.map(function (q) {
      var p = vm.person(q.by), reps = q.replies || [];
      var names = reps.map(function (r) { return short(vm.person(r.by).name).split(' ')[0]; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
      return '<li class="t-post' + (q.canonical ? ' is-canon' : '') + '">' + avatar(p, 32) +
        '<div class="t-card">' + mk(q.mark, o.annot) +
          '<p class="t-ph"><strong>' + esc(short(p.name)) + '</strong><time>' + esc(q.time) + '</time></p>' +
          (q.title ? '<p class="t-subj">' + esc(vm.fill(q.title)) + '</p>' : '') +
          '<p class="t-tx">' + esc(vm.fill(q.text)) + '</p>' +
          (q.file ? '<div class="t-att">' + ftype(q.file) + '<span><strong data-docref="' + (q.canonical ? 'canonical' : '') + '">' + esc(q.file) + '</strong><small>' + esc(vm.team) + ' › Dokumente › ' + esc(vm.scene.active) + '</small></span>' + fi('more', 't-dim') + '</div>' : '') +
          (q.canonical ? '<p class="t-react"><span>👍 ' + Math.min(4, vm.scene.members.length - 1) + '</span></p>' : '') +
          /* Replies collapsed as in the «Beiträge» layout: avatars plus «n Antworten von …». */
          (reps.length ? '<div class="t-reps"><span class="t-rav">' + reps.slice(0, 3).map(function (r) { return avatar(vm.person(r.by), 20); }).join('') + '</span>' +
            '<p class="t-more">' + reps.length + (reps.length === 1 ? ' Antwort' : ' Antworten') + ' von ' + esc(names.join(' und ')) + '</p></div>' : '') +
          '<p class="t-replyl">' + fi('reply') + 'Antworten</p>' +
        '</div></li>';
    }).join('') + '</ol>' +
    '<div class="t-compose"><span class="t-start">' + fi('edit') + 'Beitrag starten</span></div>';
  }

  function cmdbar(items) {
    return '<div class="m-cmd">' + items.map(function (i) { return '<span class="' + (i[2] || '') + '">' + fi(i[0]) + esc(i[1]) + '</span>'; }).join('') + '</div>';
  }
  function teamsFiles(vm, o) {
    return '<div class="t-files">' +
      cmdbar([['plus', 'Neu', 'm-pri'], ['upload', 'Hochladen'], ['edit', 'In Rasteransicht bearbeiten'], ['share', 'Teilen'], ['link', 'Link kopieren'], ['sync', 'Synchronisieren'], ['more', '']]) +
      '<p class="t-crumb">Dokumente <span>›</span> <strong>' + esc(vm.scene.active) + '</strong></p>' +
      fileTable(vm, vm.scene.files, o, true) + '</div>';
  }
  function fileTable(vm, files, o, withBy) {
    return '<table class="m-ft"><thead><tr><th class="m-ck"></th><th scope="col">Name</th><th scope="col">Geändert</th>' + (withBy ? '<th scope="col">Geändert von</th>' : '') + '</tr></thead><tbody>' +
      files.map(function (f) {
        var p = f.by ? vm.person(f.by) : null;
        return '<tr class="' + (f.canonical && o.select ? 'sel' : '') + '"><td class="m-ck">' + (f.canonical && o.select ? '<span class="m-tick">' + fi('check', null, true) + '</span>' : '') + '</td>' +
          '<td><span class="m-fn">' + ftype(f.name, f.kind) + '<span' + (f.canonical ? ' data-docref="canonical"' : '') + '>' + esc(f.name) + '</span>' + mk(f.mark, o.annot) + '</span></td>' +
          '<td>' + esc(f.when || 'vor 2 Wochen') + '</td>' + (withBy ? '<td>' + (p ? esc(short(p.name)) : '–') + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table>';
  }
  function teamsTasks(vm, o) {
    /* Teams «Aufgaben» tab hosts the team's Planner board (same tasks as the Planner screen). */
    if (root.M365.plannerBoard) return '<div class="t-tasks t-plan">' + root.M365.plannerBoard(vm, o, true) + '</div>';
    return '<div class="t-tasks">' + cmdbar([['plus', 'Aufgabe hinzufügen', 'm-pri'], ['filter', 'Filter'], ['view', 'Raster']]) +
      '<ul class="m-tasks"><li class="m-th" aria-hidden="true"><span></span><span>Aufgabenname</span><span>Bucket</span><span>Fällig</span><span>Zugewiesen an</span></li>' + vm.scene.tasks.map(function (t) {
        var p = vm.person(t.owner);
        return '<li class="' + (t.done ? 'done' : '') + '"><span class="m-circ">' + (t.done ? fi('check', null, true) : '') + '</span>' +
          '<span class="m-tn">' + esc(t.title) + mk(t.mark, o.annot) + '</span><span>' + esc(t.bucket) + '</span><span>' + (t.done ? 'erledigt' : esc(t.due)) + '</span>' +
          '<span class="m-own">' + avatar(p, 24) + esc(short(p.name)) + '</span><span class="sr-only">' + (t.done ? 'Erledigt' : 'Offen') + '</span></li>';
      }).join('') + '</ul></div>';
  }

  /* ================= Outlook ================= */
  function outlook(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer), sel = st.mails[0];
    var list = st.mails.map(function (m, i) { return { m: m, i: i }; }).reverse();
    var from = vm.person(sel.by);
    var others = st.otherMail.map(function (x) { return '<li class="o-it">' + avatar(vm.person(x.by), 32) + '<div><p class="o-from">' + esc(short(vm.person(x.by).name)) + '<time>' + esc(x.time) + '</time></p><p class="o-subj">' + esc(x.subject) + '</p><p class="o-prev">' + esc(x.preview) + '</p></div></li>'; }).join('');
    return frame('m3-outlook', 'Outlook, nachgebildet: Posteingang von ' + me.name,
      '<div class="o-top">' + fi('waffle', 'o-waf') + '<strong>Outlook</strong><span class="o-search">' + fi('search') + '<span>Suchen</span></span>' +
        '<span class="o-tr">' + fi('bell') + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="o-rail" aria-hidden="true">' + fi('mail', 'on') + fi('calendar') + fi('people') + fi('onedrive') + fi('apps') + '</nav>' +
      '<div class="o-ribbon"><span class="o-tabs"><b>Start</b><span>Ansicht</span><span>Hilfe</span></span>' +
        '<span class="o-cmds"><span class="o-new">' + fi('mail') + 'Neue E-Mail</span>' + fi('trash') + '<span>Archivieren</span><span>Antworten</span><span>Allen antworten</span><span>Weiterleiten</span></span></div>' +
      '<aside class="o-folders"><p class="o-fh">' + fi('chevd') + 'Favoriten</p>' +
        '<ul><li class="on">' + fi('inbox') + 'Posteingang<b>' + (st.mails.length) + '</b></li><li>' + fi('send') + 'Gesendete Elemente</li><li>' + fi('draft') + 'Entwürfe</li></ul>' +
        '<p class="o-fh">' + fi('chevd') + esc(short(me.name)) + '</p><ul><li>' + fi('inbox') + 'Posteingang<b>' + st.mails.length + '</b></li><li>' + fi('draft') + 'Entwürfe</li><li>' + fi('send') + 'Gesendete Elemente</li><li>' + fi('trash') + 'Gelöschte Elemente</li><li>' + fi('view') + 'Archiv</li></ul></aside>' +
      '<section class="o-list"><div class="o-lh"><strong>Posteingang</strong>' + fi('star') + '</div>' +
        '<div class="o-pivot"><b>Relevant</b><span>Sonstige</span>' + fi('filter') + '</div><p class="o-grp">Diese Woche</p>' +
        '<ul>' + list.map(function (x) {
          var m = x.m, p = vm.person(m.by), on = x.i === 0;
          return '<li class="o-it' + (on ? ' on' : ' unread') + '">' + avatar(p, 32) + '<div><p class="o-from">' + esc(short(p.name)) + '<time>' + esc(m.time) + '</time></p>' +
            '<p class="o-subj">' + (m.attachment ? fi('clip') : '') + esc(m.subject) + '</p><p class="o-prev">' + esc(m.body.replace(/\s+/g, ' ')) + '</p>' +
            (m.attachment ? '<p class="o-chip">' + ftype(m.attachment.name) + esc(m.attachment.name) + '</p>' : '') + '</div></li>';
        }).join('') + '</ul><p class="o-grp">Letzte Woche</p><ul>' + others + '</ul></section>' +
      '<section class="o-read"><h3 class="o-rsubj" data-mail="subject">' + esc(sel.subject) + '</h3>' +
        '<div class="o-rh">' + avatar(from, 40) + '<div><p><strong>' + esc(short(from.name)) + '</strong></p><p class="o-to">An: ' + sel.to.map(function (id) { return esc(short(vm.person(id).name)); }).join('; ') + '</p></div>' +
          '<span class="o-ract">' + fi('smile') + fi('reply') + fi('more') + '</span><time>' + esc(sel.time) + '</time></div>' +
        (sel.attachment ? '<div class="o-atts"><div class="o-att">' + ftype(sel.attachment.name) + '<span><strong data-docref="copy">' + esc(sel.attachment.name) + '</strong><small>' + esc(sel.attachment.size) + '</small></span>' + fi('chevd') + mk(1, o.annot) + '</div></div>' : '') +
        '<div class="o-body" data-mail="body">' + nl2br(sel.body) + '</div>' +
        '<div class="o-replybar"><span>' + fi('reply') + 'Antworten</span><span>Allen antworten</span><span>Weiterleiten</span></div>' +
      '</section>');
  }

  /* ================= Windows 11 Explorer ================= */
  function explorer(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer);
    var rows = [];
    st.copies.forEach(function (c, i) {
      rows.push({ name: c.name, time: c.time, size: c.size, mark: 1, copy: true });
      if (i === st.redownload) rows.push({ name: c.name.replace(/(\.[a-z0-9]+)$/i, ' (1)$1'), time: c.time, size: c.size, mark: 2, copy: true });
    });
    rows.push({ name: 'Rechnung_Hotel_Bern.pdf', time: 'Fr', size: '212 KB' });
    var day = function (t) { return /^(Mo|Di|Mi|Do|Fr|Sa|So)\s/.test(t) ? t.split(' ')[0] : t; };
    var dates = { Mo: '20.10.2026', Di: '21.10.2026', Mi: '22.10.2026', Do: '23.10.2026', Fr: '17.10.2026' };
    var clock = function (t) { var m = /(\d\d:\d\d)/.exec(t); return m ? m[1] : '08:30'; };
    return frame('m3-explorer', 'Windows Explorer, nachgebildet: Downloads von ' + me.name,
      '<div class="x-titl"><span class="x-tab">' + '<span class="ft ft-folder ft-s"></span>Downloads<span class="x-tx">' + fi('close') + '</span></span><span class="x-plus">' + fi('plus') + '</span>' +
        '<span class="x-win">' + fi('window') + fi('max') + fi('close') + '</span></div>' +
      '<div class="x-addr"><span class="x-navb">' + fi('back') + fi('fwd') + fi('up') + fi('refresh') + '</span>' +
        '<span class="x-path">' + fi('pc') + '<span>›</span>Dieser PC<span>›</span><b>Downloads</b></span>' +
        '<span class="x-search">' + fi('search') + 'Downloads durchsuchen</span></div>' +
      '<div class="x-cmd"><span class="x-new">' + fi('plus') + 'Neu' + fi('chevd') + '</span><i></i>' + fi('cut') + fi('copy') + fi('paste') + fi('edit') + fi('share') + fi('trash') + '<i></i>' +
        '<span>' + fi('sort') + 'Sortieren' + fi('chevd') + '</span><span>' + fi('view') + 'Anzeigen' + fi('chevd') + '</span>' + fi('more') + '<span class="x-det">' + fi('info') + 'Details</span></div>' +
      '<aside class="x-nav"><ul><li>' + fi('home') + 'Start</li><li>' + fi('pic') + 'Katalog</li><li class="x-od">' + fi('onedrive') + esc(short(me.name)) + ' – Persönlich</li></ul>' +
        '<ul><li>' + fi('pc') + 'Desktop</li><li class="on">' + fi('download') + 'Downloads</li><li>' + fi('draft') + 'Dokumente</li><li>' + fi('pic') + 'Bilder</li></ul>' +
        '<ul><li>' + fi('pc') + 'Dieser PC</li><li>' + fi('pc') + 'Netzwerk</li></ul></aside>' +
      '<section class="x-main"><table class="x-tbl"><thead><tr><th>Name</th><th>Änderungsdatum</th><th>Typ</th><th>Grösse</th></tr></thead><tbody>' +
        '<tr class="x-grp"><td colspan="4">' + fi('chevd') + 'Diese Woche</td></tr>' +
        rows.map(function (r, i) {
          return '<tr class="' + (i === 0 ? 'sel' : '') + '"><td><span class="m-fn">' + ftype(r.name) + '<span' + (r.copy ? ' data-docref="copy"' : '') + '>' + esc(r.name) + '</span>' + mk(r.mark, o.annot && (i === 0 || r.mark === 2)) + '</span></td>' +
            '<td>' + (dates[day(r.time)] || '24.10.2026') + ' ' + clock(r.time) + '</td><td>' + typeName(r.name) + '</td><td class="x-r">' + esc(r.size) + '</td></tr>';
        }).join('') + '</tbody></table></section>' +
      '<div class="x-status"><span>' + rows.length + ' Elemente</span><span>1 Element ausgewählt  ' + esc(rows[0].size) + '</span></div>');
  }

  /* ================= SharePoint document library ================= */
  function sharepoint(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer);
    var nav = ['Startseite', 'Unterhaltungen', 'Dokumente', 'Freigegeben für uns', 'Notizbuch', 'Seiten', 'Websiteinhalte'];
    return frame('m3-sharepoint', 'SharePoint, nachgebildet: Teamwebsite ' + vm.team + ', Dokumente',
      '<div class="s-suite">' + fi('waffle', 's-waf') + '<strong>SharePoint</strong><span class="s-search">' + fi('search') + '<span>Auf dieser Website suchen</span></span>' +
        '<span class="s-tr">' + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="s-app" aria-hidden="true">' + fi('home') + fi('star') + fi('draft') + fi('onedrive') + fi('plus') + '</nav>' +
      '<header class="s-site"><span class="t-tile t-tile-l t-tile-' + (vm.world.id.length % 5) + '">' + esc(initials(vm.team)) + '</span><div><p class="s-name">' + esc(vm.team) + '</p>' +
        '<ul class="s-nav">' + nav.map(function (n) { return '<li' + (n === 'Dokumente' ? ' class="on"' : '') + '>' + n + '</li>'; }).join('') + '</ul></div>' +
        '<span class="s-priv">' + fi('people') + 'Private Gruppe · ' + vm.scene.members.length + ' Mitglieder</span></header>' +
      '<div class="s-cmdrow">' + cmdbar([['plus', 'Neu', 'm-pri'], ['upload', 'Hochladen'], ['edit', 'In Rasteransicht bearbeiten'], ['share', 'Teilen'], ['link', 'Link kopieren'], ['sync', 'Synchronisieren'], ['more', '']]) +
        '<span class="s-view">' + fi('view') + 'Alle Dokumente' + fi('chevd') + fi('filter') + fi('info') + '</span></div>' +
      '<section class="s-lib"><p class="s-crumb">Dokumente <span>›</span> <strong>' + esc(vm.scene.active) + '</strong></p>' +
        fileTable(vm, vm.scene.files, { annot: false, select: true }, true).replace('<th scope="col">Geändert von</th>', '<th scope="col">Geändert von</th><th class="s-add">+ Spalte hinzufügen</th>').replace(/<\/td><\/tr>/g, '</td><td></td></tr>') +
      '</section>' +
      '<aside class="s-pane"><p class="s-ph">' + ftype(st.doc.name) + '<strong data-docref="canonical">' + esc(st.doc.name) + '</strong></p>' +
        '<p class="s-k">Zugriff</p><p>' + esc(vm.team) + ' – Mitglieder</p>' +
        '<p class="s-k">Geändert</p><p>' + esc(st.doc.when) + ' von ' + esc(short(vm.person(st.doc.by).name)) + '</p>' +
        '<p class="s-k">Speicherort</p><p>Dokumente › ' + esc(vm.scene.active) + '</p>' +
        '<p class="s-k">Versionsverlauf</p><p>Eine Datei, alle Änderungen im Verlauf</p>' + mk(1, o.annot) + '</aside>');
  }

  var APPS = { teams: teams, outlook: outlook, explorer: explorer, sharepoint: sharepoint };
  var NOTES = {};
  /* Tool for a scene sub-route: the old Teams tab routes (posts/files/tasks) stay valid. */
  function toolOf(sub) { return APPS[sub] && sub !== 'teams' ? sub : 'teams'; }
  function available(vm, tool) { return (vm.tools || []).indexOf(tool) >= 0; }
  function app(vm, sub, o) {
    o = o || {};
    var tool = toolOf(sub);
    if (!available(vm, tool)) return null;
    return tool === 'teams' ? teams(vm, Object.assign({}, o, { tab: sub })) : APPS[tool](vm, o);
  }
  /* Further renderers (src/m365-more.js) register here. */
  function register(id, fn, notesFn) { APPS[id] = fn; if (notesFn) NOTES[id] = notesFn; }

  /* Teaching notes per tool, shown outside the application (slide column / workspace). */
  function notes(vm, sub) {
    var tool = toolOf(sub), st = vm.story;
    if (NOTES[tool]) return NOTES[tool](vm);
    if (tool === 'teams') {
      if (sub === 'tasks' && NOTES.planner) return NOTES.planner(vm);
      var sc = vm.scene, tab = sub === 'files' || sub === 'tasks' ? sub : 'posts';
      var items = tab === 'files' ? sc.files : tab === 'tasks' ? sc.tasks : sc.posts, marks = [];
      items.forEach(function (x) { if (x.mark && marks.indexOf(x.mark) < 0 && sc.notes[x.mark]) marks.push(x.mark); });
      return marks.map(function (m) { return [m, vm.fill(sc.notes[m])]; });
    }
    var doc = st.doc.name, c0 = st.copies[0];
    if (tool === 'outlook') return [[1, short(vm.person(c0.by).name) + ' verschickt «' + c0.name + '» als Anhang. Jede Person, die ihn öffnet und ändert, erzeugt eine eigene Fassung.']];
    if (tool === 'explorer') return [[1, st.copies.length + ' Kopien desselben Plans aus verschiedenen Mails. Keine zeigt sicher den aktuellen Stand.'], [2, 'Zweimal heruntergeladen: Windows hängt «(1)» an. Noch eine Fassung.']];
    return [[1, '«' + doc + '» liegt einmal in der Bibliothek des Teams. Teams-Kanal und SharePoint zeigen dieselbe Datei.']];
  }

  root.M365 = { app: app, register: register, teamsChrome: teamsChrome, fileTable: fileTable, available: available, avatar: avatar, ftype: ftype, frame: frame, mk: mk, cmdbar: cmdbar, nl2br: nl2br, teams: teams, outlook: outlook, explorer: explorer, sharepoint: sharepoint, toolOf: toolOf, notes: notes, W: W, H: H, fi: fi };
})(window);
