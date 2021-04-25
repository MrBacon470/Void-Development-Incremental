export const heros = {
    "350057688182292482": {
        profileImage: "avatars/4033eea2a3b4cb76aa7b2cb44fc854bd.png",
        username: "TheMKeyHolder",
        role: 'contributor',
        status: "Online",
        playing: "OM:R"
    },
    "667109969438441486": {
        profileImage: "avatars/d0ce3ad8fb2a3fb06f58982cb0034a5b.png",
        username: "VoidCloud",
        role: 'developer',
        status: "DND",
        playing: "Void Development Incremental"
    },
    "708748287909298318": {
        profileImage: "avatars/eb0ab23ac4f5594022c8c21cce460174.png",
        username: "Flame",
        role: 'staff-admin',
        status: "Online",
        customStatus: ":yellow_small_man_moving_quickly:"
    },
    "543817742487388179": {
        profileImage: "avatars/a_92318f24a5d7f28e9bd89f02fb2bfdba.gif",
        username: "avocado",
        role: 'contributor',
        status: "Online",
        customStatus: "Testing long names"
    },
    "366022305668923402": {
        profileImage: "avatars/2d139cf3e0b984d49fbc24704c3142f9.png",
        username: "Kuaka",
        role: 'kuaka-salesman',
        status: "Offline",
        customStatus: "Swag Coin"
    },
    "596115906153807882": {
        profileImage: "avatars/65781bcb0c4eff2f5b2bb545aa5d59fb.png",
        username: "Jacorb",
        role: 'staff-admin',
        status: 'Idle',
        customStatus: 'Snoopers gonna snoop'
    },
    "131211055849275392": {
        profileImage: "avatars/f9abf31d943912a5c9899fe8f875c9a0.png",
        username: "thepaperpilot",
        role: 'staff-helper',
        status: 'Online',
        playing: 'Sublime Text'
    },
    "296003621009620992": {
        profileImage: "avatars/db13ecbc27a88df332af9db33d437d6c.png",
        username: "Semenar",
        role: 'contributor',
        status: 'Online',
        customStatus: ''
    },
    "607942184167145506": {
        profileImage: "avatars/a61a4b8fb66bcb4b991666c79a60dd95.png",
        username: "unpingabot",
        role: 'staff-admin',
        status: 'Online',
        customStatus:''
    },
    "330360353185857567": {
        profileImage: "avatars/a97604bafd23e442bd8824b7592b92c6.png",
        username: "epicness1582",
        role: 'staff-helper',
        status: 'Online',
        customStatus: "I'm a sneaky snake"
    },
    "752728129126006905": {
        profileImage: "avatars/0b369646bb30492f3644e1a12194aa65.png",
        username: "dratini123",
        role: "contributor",
        status: "Online",
        customStatus: ''
    },
    "422117994915954699": {
        profileImage: "avatars/bcf24f8f01923a3190fbf3c0ed6003ca.png",
        username: "Waddles",
        role: "booster",
        status: "DND",
        customStatus: ''
    },
    "392092706727264256": {
        profileImage: "avatars/6db293b54467f2f5e6126057b6d2c07d.png",
        username: "rock",
        role: "booster",
        status: "Online",
        customStatus: ''
    },
    "712738568442871849": {
        profileImage: "avatars/bef0d98e4bcc9aec4944455efa25b24d.png",
        username: "unpogged",
        role: "staff-helper",
        status: "Offline",
        customStatus: ''
    },
    "440441586317393920": {
        profileImage: "avatars/619a6b95c42ae7e164135069b2bc7b8e.png",
        username: "ducdat0507",
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
    while (window.player.users[name]) {
        name += nameList[Math.floor(Math.random() * nameList.length)];
    }
    return name;
}

export const roles = {
    'developer': { title: 'DEVELOPER', color: 'rgb(184, 105, 255)' },
    'staff-admin': { title: 'STAFF-ADMIN', color: 'rgb(255, 59, 125)' },
    'staff-helper': { title: 'STAFF-HELPER', color: 'rgb(127, 245, 206)'},
    'booster': {title: 'VOID CRYSTALLINE', color: '#f47fff'},
    'contributor': {title: 'CONTRIBUTOR', color: 'rgb(131, 126, 252)'},
    'kuaka-salesman': { title: 'KUAKA SALESMAN', color: 'rgb(189, 17, 255)' },
}
