import styles from './leaderboard.module.css';

// --- Types ---
interface User {
  rank: number;
  name: string;
  points: string; 
  marks: number;
  avatarColor?: string; 
}

// --- Icons (SVG) ---
const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2H17V4H19C20.6569 4 22 5.34315 22 7V8C22 10.2091 20.2091 12 18 12H16.89C16.4251 14.7766 14.0305 17 11.2 17H12.8C12.8 17 13.6 19.4 14.4 20H9.6C10.4 19.4 11.2 17 11.2 17H7.11001C4.27956 17 1.8849 14.7766 1.41999 12H0.309998V11C0.309998 8.79086 2.10086 7 4.30999 7H7V2ZM17 6V10H18C19.1046 10 20 9.10457 20 8V7C20 6.44772 19.5523 6 19 6H17ZM7 10V6H5C4.44772 6 4 6.44772 4 7V8C4 9.10457 4.89543 10 6 10H7Z" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.64 2.23924C11.8329 1.99615 12.1671 1.99615 12.36 2.23924L15.3577 6.01636L21.3256 6.55835C21.6441 6.58728 21.8028 6.96443 21.5898 7.18663L16.208 12.8016L17.7262 21.149C17.7852 21.4735 17.4363 21.7235 17.1528 21.5606L12 18.6L6.84719 21.5606C6.56365 21.7235 6.21484 21.4735 6.27377 21.149L7.79196 12.8016L2.41022 7.18663C2.19725 6.96443 2.35593 6.58728 2.67439 6.55835L8.64234 6.01636L11.64 2.23924Z" />
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// --- Dummy Data (JEE-style leaderboard) ---

const TOP_USERS: User[] = [
  {
    rank: 2,
    name: "Aarav Sharma",
    points: "99.987 %",
    marks: 295,
    avatarColor: "linear-gradient(135deg, #1e1d1b 0%, #36312F 100%)",
  },
  {
    rank: 1,
    name: "Ritvik Gupta",
    points: "99.998 %",
    marks: 298,
    avatarColor: "linear-gradient(135deg, #D4AF37 0%, #8C7323 100%)",
  },
  {
    rank: 3,
    name: "Kunal Mehta",
    points: "99.982 %",
    marks: 293,
    avatarColor: "linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)",
  }
];

// Generate remaining users with marks
const TABLE_USERS: User[] = [
  { rank: 4, name: "Ananya Verma", points: "99.975 %", marks: 292, avatarColor: "" },
  { rank: 5, name: "Siddharth Jain", points: "99.970 %", marks: 291, avatarColor: "" },
  { rank: 6, name: "Neha Kapoor", points: "99.962 %", marks: 290, avatarColor: "" },
  { rank: 7, name: "Aditya Singh", points: "99.955 %", marks: 289, avatarColor: "" },
  { rank: 8, name: "Pooja Nair", points: "99.949 %", marks: 288, avatarColor: "" },
  { rank: 9, name: "Rahul Mishra", points: "99.942 %", marks: 287, avatarColor: "" },
  { rank: 10, name: "Ishaan Khanna", points: "99.935 %", marks: 286, avatarColor: "" },
  { rank: 11, name: "Priya Patel", points: "99.930 %", marks: 285, avatarColor: "" },
  { rank: 12, name: "Vikram Reddy", points: "99.925 %", marks: 284, avatarColor: "" },
  { rank: 13, name: "Sneha Desai", points: "99.920 %", marks: 283, avatarColor: "" }
];

const ALL_USERS = [...TOP_USERS, ...TABLE_USERS];


// --- Helper Function ---
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

// --- Sub-components ---

const HeroCard = ({ user }: { user: User }) => {
  const initial = getInitial(user.name);
  
  return (
    <div className={`${styles.heroCard} ${styles[`rank${user.rank}`]}`}>
      <div className={styles.avatarWrapper}>
        <div 
          className={styles.avatar}
          style={{ background: user.avatarColor, fontSize: user.rank === 1 ? '42px' : '28px' }}
        >
          {initial}
        </div>
      </div>
      
      <div className={styles.heroName}>{user.name}</div>
      
      <div className={styles.podium}>
        <div className={styles.badge}>
          <TrophyIcon />
          <span>Rank : {user.rank}</span>
        </div>
        <div className={styles.prizeContainer}>
          <div className={styles.prizeValue}>
            {user.marks}/300
          </div>
          <div className={styles.prizeLabel}>Marks</div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ user }: { user: User }) => {
  
  return (
    <div className={styles.gridRow} role="row">
      {/* Rank */}
      <div className={styles.rankCell} role="cell">
        <div className={styles.rankCircle} />
        <span className={styles.rankNumber}>{`#${user.rank.toString().padStart(2, '0')}`}</span>
      </div>

      {/* Student Name with Avatar */}
      <div className={styles.userCell} role="cell">
        <span>{user.name}</span>
      </div>

      {/* Percentile */}
      <div className={styles.volumeCell} role="cell">
        {user.points}
      </div>

      {/* Score Column */}
      <div className={`${styles.pointsCell} ${styles.hiddenMobile}`} role="cell">
        {user.marks}/300
      </div>
    </div>
  );
};

// --- Main Component ---

const Leaderboard: React.FC = () => {
  // Sort users by rank
  const sortedUsers = [...ALL_USERS].sort((a, b) => a.rank - b.rank);
  
  // Get top 3 for hero section
  const topThree = sortedUsers.filter(user => user.rank <= 3);
  
  // Get table rows starting from rank 4
  const tableRows = sortedUsers.filter(user => user.rank >= 4).slice(0, 10);

  return (
    <div className={styles.themeWrapper}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        {topThree.map(user => (
          <HeroCard key={user.name} user={user} />
        ))}
      </div>

      {/* Personal Stats Pill */}
      <div className={styles.userStatsPill}>
        <span className={styles.pillHighlight}>All India Rank: — #54</span> out of <span className={styles.pillHighlight}>10,800</span> students
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>JEE Main 2025 Leaderboard</div>
          <button className={styles.showAllBtn}>View Full Ranking</button>
        </div>

        <div className={styles.gridTable} role="table">
          <div className={styles.gridHeader} role="rowgroup">
            <div>Rank</div>
            <div>Student Name</div>
            <div>Percentile</div>
            <div className={styles.hiddenMobile} style={{ textAlign: 'right' }}>Score</div>
          </div>

          {tableRows.map(user => <TableRow key={user.rank} user={user} />)}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;