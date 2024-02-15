import os from 'node:os';

const printVlcXSPFTemplate = (bookmarks: string, path: string) => {
  let template = `
  <?xml version="1.0" encoding="UTF-8"?>
  <playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1">
    <title>Playlist</title>
    <trackList>
      <track>
        <location>file:///{%VIDEO_DIR%}</location>
        <duration>59956292</duration>
        <extension application="http://www.videolan.org/vlc/playlist/0">
          <vlc:id>0</vlc:id>
          <vlc:option>{%BOOKMARKS%}</vlc:option>
        </extension>
      </track>
    </trackList>
    <extension application="http://www.videolan.org/vlc/playlist/0">
      <vlc:item tid="0"/>
    </extension>
  </playlist>
`;

  const video_dir = path.replaceAll(' ', '%20').replaceAll('\\', '/');

  template = template.replace(/\{\%BOOKMARKS\%\}/, bookmarks);
  template = template.replace(/\{\%VIDEO_DIR\%\}/, video_dir);

  return template.trim();
};

const timestampsStrFormatter = (
  str: string,
  options?: { separator: string; timeLeftBr?: string; timeRightBr?: string }
): Array<Array<string>> => {
  const defaults = Object.assign(
    {},
    {
      separator: '-',
      timeLeftBr: undefined,
      timeRightBr: undefined,
    },
    options
  );

  const { separator, timeLeftBr, timeRightBr } = defaults;

  return str
    .trim()
    .split(os.EOL)
    .filter(Boolean)
    .map((str) => {
      let [time, desc] = str.trim().split(separator);

      time = time.trim();

      if (timeLeftBr && timeRightBr) {
        time.replace(timeLeftBr, '').replace(timeRightBr, '');
      }

      desc = desc.trim();
      return [time, desc];
    });
};

const bookmarksTimeline = (timestampsArr: Array<Array<string>>) => {
  const bookmarkBuilder = (str: string, time: number) => {
    return `{name=${str},time=${time}}`;
  };

  const bookmarksArr: string[] = [];

  for (let [key, value] of timestampsArr) {
    const timeArrStr = key.split(':');

    if (timeArrStr.length === 1) {
      for (let i = 0; i < 2; i++) {
        timeArrStr.unshift('00');
      }
    }

    if (timeArrStr.length === 2) {
      timeArrStr.unshift('00');
    }

    const timeArr = timeArrStr.map((num) => Number(num));

    const timeInSecs = timeArr.reduce((acc: number, curr: number, i) => {
      let multiple;
      if (i === 0) {
        multiple = curr * 60 * 60;
      } else if (i === 1) {
        multiple = curr * 60;
      } else {
        multiple = curr;
      }

      return (acc === 1 ? 0 : acc) + multiple;
    }, 1);

    bookmarksArr.push(bookmarkBuilder(`[${key}]: ${value}`, timeInSecs));
  }

  console.log(bookmarksArr);

  return `bookmarks=${bookmarksArr.join(',')}`;
};

// string paste
const str = `
  00:00 - Intro
  00:16 - Demo
  04:59 - Setup and Installing Packages
  06:32 - Supabase Database Setup
  07:55 - Setting Up Drizzle ORM
  28:39 - Shadcn UI Library for nextjs 13
  30:30 - How to import figma colors into our app
  31:40 - Light and Dark mode setup
  35:23 - Landing Page
  01:12:59 - Login & Signup Authentication with Supabase
  01:32:55 - How to build a Navigation Bar in Nextjs 13
  02:28:42 - How to build a Workspace Dashboard 
  02:45:12 - How to create an Emoji Picker Component
  03:00:30 - Image Domain Authorization
  03:04:35 - How to build a Sidebar
  04:32:34 - Building a Plan Usage Component
  04:41:47 - Building a custom Dropdown
  04:52:36 - ERROR Too many open connections 
  05:00:23 - CHALLENGE
  07:11:33 - How to build a real time text editor
  07:55:48 - Create Bread Crumbs
  08:32:31 - Socket Io for realtime collaboration
  09:24:16 - Real time cursors and collaborator presence
  09:39:44 - The next video will blow your mind! 
  10:24:21 - How to setup Stripe in Nextjs 13
  11:19:28 - How to build move to trash feature 
  11:29:49 - Become a prodigy today
  11:29:58 - Deployment
  11:41:09 - A little secret for those who stayed
`;
const videoPath =
  'E:/07.02. NextJS/YouTube - Web Prodigies/SaaS Notion Clone with Realtime cursors/SaaS Notion Clone with Realtime cursors.mp4';

const timestampsArr = timestampsStrFormatter(str);

const bookmarks = bookmarksTimeline(timestampsArr);
const playlist = printVlcXSPFTemplate(bookmarks, videoPath);

console.log('\n\n');
console.log(
  'Copy xml and paste to notepad and save file as playlist.xspf: [name].xspf \n'
);

console.log(playlist);
