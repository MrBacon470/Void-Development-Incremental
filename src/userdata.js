export const userdata = {
    "350057688182292482": {
        profileImage: "https://cdn.discordapp.com/avatars/350057688182292482/4033eea2a3b4cb76aa7b2cb44fc854bd.webp?size=128",
        username: "TheMKeyHolder",
        role: 'contributor',
        status: "Online",
        playing: "OM:R"
    },
    "667109969438441486": {
        profileImage: "https://cdn.discordapp.com/avatars/667109969438441486/8c1305df7b7a59043d71856f1af42419.png?size=128",
        username: "VoidCloud",
        role: 'developer',
        status: "DND",
        playing: "Void Development Incremental"
    },
    "708748287909298318": {
        profileImage: "https://cdn.discordapp.com/avatars/708748287909298318/a_371eb402927697221fe3b59b0a315537.gif?size=1024",
        username: "Flame",
        role: 'staff-admin',
        status: "Idle",
        customStatus: "Idle Status.js"
    },
    "543817742487388179": {
        profileImage: "https://cdn.discordapp.com/avatars/543817742487388179/801863b7b703ca8481108f20fa95bc31.png?size=128",
        username: "avocado",
        role: 'contributor',
        status: "Online",
        customStatus: "Testing long names"
    },
    "366022305668923402": {
        profileImage: "https://cdn.discordapp.com/avatars/366022305668923402/2d139cf3e0b984d49fbc24704c3142f9.webp?size=1024",
        username: "Kuaka",
        role: 'kuaka-salesman',
        status: "Offline",
        customStatus: "Swag Coin"
    },
    "596115906153807882": {
        profileImage: "https://cdn.discordapp.com/avatars/596115906153807882/65781bcb0c4eff2f5b2bb545aa5d59fb.webp?size=1024",
        username: "Jacorb",
        role: 'staff-admin',
        status: 'Idle',
        customStatus: 'Snoopers gonna snoop'
    },
    "131211055849275392": {
        profileImage: "https://cdn.discordapp.com/avatars/131211055849275392/f9abf31d943912a5c9899fe8f875c9a0.webp?size=1024",
        username: "thepaperpilot",
        role: 'staff-helper',
        status: 'Online',
        playing: 'Sublime Text'
    },
    "296003621009620992": {
        profileImage: "https://cdn.discordapp.com/avatars/296003621009620992/db13ecbc27a88df332af9db33d437d6c.webp?size=1024",
        username: "Semenar",
        role: 'contributor',
        status: 'Online',
        customStatus: ''
    },
    "607942184167145506": {
        profileImage: "https://cdn.discordapp.com/avatars/607942184167145506/8f88e5d898c1520aa7c9859b2f27687a.webp?size=1024",
        username: "unpingabot",
        role: 'staff-admin',
        status: 'Online',
        customStatus:''
    },
    "330360353185857567": {
        profileImage: "https://cdn.discordapp.com/avatars/330360353185857567/f8d0acfe41f6fa157d83e381ec53f6f9.webp?size=1024",
        username: "epicness1582",
        role: 'staff-helper',
        status: 'Online',
        customStatus: "I'm a sneaky snake"
    },
    "752728129126006905": {
        profileImage: "https://cdn.discordapp.com/avatars/752728129126006905/0b369646bb30492f3644e1a12194aa65.webp?size=1024",
        username: "dratini123",
        role: "contributor",
        status: "Online",
        customStatus: ''
    }
};

// Taken from https://codepen.io/jamesrbdev/pen/WxyKyr
// Also considered https://github.com/cupcakearmy/canihazusername
var nameList = [
  'Time','Past','Future','Dev',
  'Fly','Flying','Soar','Soaring','Power','Falling',
  'Fall','Jump','Cliff','Mountain','Rend','Red','Blue',
  'Green','Yellow','Gold','Demon','Demonic','Panda','Cat',
  'Kitty','Kitten','Zero','Memory','Trooper','XX','Bandit',
  'Fear','Light','Glow','Tread','Deep','Deeper','Deepest',
  'Mine','Your','Worst','Enemy','Hostile','Force','Video',
  'Game','Donkey','Mule','Colt','Cult','Cultist','Magnum',
  'Gun','Assault','Recon','Trap','Trapper','Redeem','Code',
  'Script','Writer','Near','Close','Open','Cube','Circle',
  'Geo','Genome','Germ','Spaz','Shot','Echo','Beta','Alpha',
  'Gamma','Omega','Seal','Squid','Money','Cash','Lord','King',
  'Duke','Rest','Fire','Flame','Morrow','Break','Breaker','Numb',
  'Ice','Cold','Rotten','Sick','Sickly','Janitor','Camel','Rooster',
  'Sand','Desert','Dessert','Hurdle','Racer','Eraser','Erase','Big',
  'Small','Short','Tall','Sith','Bounty','Hunter','Cracked','Broken',
  'Sad','Happy','Joy','Joyful','Crimson','Destiny','Deceit','Lies',
  'Lie','Honest','Destined','Bloxxer','Hawk','Eagle','Hawker','Walker',
  'Zombie','Sarge','Capt','Captain','Punch','One','Two','Uno','Slice',
  'Slash','Melt','Melted','Melting','Fell','Wolf','Hound',
  'Legacy','Sharp','Dead','Mew','Chuckle','Bubba','Bubble','Sandwich',
  'Smasher','Extreme','Multi','Universe','Ultimate','Death','Ready',
  'Monkey','Elevator','Wrench','Grease','Head','Theme','Grand','Cool',
  'Kid','Boy','Girl','Vortex','Paradox'
];
export function getRandomUser() {
    let name = nameList[Math.floor(Math.random() * nameList.length)];
    name += nameList[Math.floor(Math.random() * nameList.length)];
    if (Math.random() > 0.5) {
        name += nameList[Math.floor(Math.random() * nameList.length)];
    }
    while (window.player.users.includes(name)) {
        name += nameList[Math.floor(Math.random() * nameList.length)];
    }
    return name;
}

export const roles = {
    'developer': { title: 'DEVELOPER', color: 'rgb(184, 105, 255)' },
    'staff-admin': { title: 'STAFF-ADMIN', color: 'rgb(255, 59, 125)' },
    'staff-helper': { title: 'STAFF-HELPER', color: 'rgb(127, 245, 206)'},
    'contributor': {title: 'CONTRIBUTOR', color: 'rgb(131, 126, 252)'},
    'kuaka-salesman': { title: 'KUAKA SALESMAN', color: 'rgb(189, 17, 255)' },
}
