"use client";

import React, { useState } from 'react';
import styles from './leaderboard.module.css';
import { FiChevronLeft, FiChevronRight, FiLock } from 'react-icons/fi';

// --- Types ---
interface User {
  rank: number;
  name: string;
  points: string;
  marks: number;
  avatarColor?: string;
}

// --- Icons ---
const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2H17V4H19C20.6569 4 22 5.34315 22 7V8C22 10.2091 20.2091 12 18 12H16.89C16.4251 14.7766 14.0305 17 11.2 17H12.8C12.8 17 13.6 19.4 14.4 20H9.6C10.4 19.4 11.2 17 11.2 17H7.11001C4.27956 17 1.8849 14.7766 1.41999 12H0.309998V11C0.309998 8.79086 2.10086 7 4.30999 7H7V2ZM17 6V10H18C19.1046 10 20 9.10457 20 8V7C20 6.44772 19.5523 6 19 6H17ZM7 10V6H5C4.44772 6 4 6.44772 4 7V8C4 9.10457 4.89543 10 6 10H7Z" />
  </svg>
);

// --- Data Generation Helpers ---
const generateMoreUsers = (startRank: number, count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const rank = startRank + i;
    return {
      rank: rank,
      name: `Student Name ${rank}`,
      points: `${(99.9 - (rank * 0.01)).toFixed(3)} %`,
      marks: 290 - Math.floor(rank / 2),
      avatarColor: ""
    };
  });
};

const getInitial = (name: string): string => name.charAt(0).toUpperCase();

// --- Constants ---
const TOP_USERS: User[] = [
  { rank: 1, name: "Ritvik Gupta", points: "99.998 %", marks: 298, avatarColor: "linear-gradient(135deg, #D4AF37 0%, #8C7323 100%)" },
  { rank: 2, name: "Aarav Sharma", points: "99.987 %", marks: 295, avatarColor: "linear-gradient(135deg, #1e1d1b 0%, #36312F 100%)" },
  { rank: 3, name: "Kunal Mehta", points: "99.982 %", marks: 293, avatarColor: "linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)" }
];

const TABLE_USERS_MOCK: User[] = generateMoreUsers(4, 20);
const ALL_USERS_MOCK = [...TOP_USERS, ...TABLE_USERS_MOCK];

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
          <div className={styles.prizeValue}>{user.marks}/300</div>
          <div className={styles.prizeLabel}>Marks</div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ user }: { user: User }) => (
  <div className={styles.gridRow} role="row">
    <div className={styles.rankCell} role="cell">
      <div className={styles.rankCircle} />
      <span className={styles.rankNumber}>{`#${user.rank.toString().padStart(2, '0')}`}</span>
    </div>
    <div className={styles.userCell} role="cell">
      <span>{user.name}</span>
    </div>
    <div className={styles.volumeCell} role="cell">
      {user.points}
    </div>
    <div className={`${styles.pointsCell} ${styles.hiddenMobile}`} role="cell">
      {user.marks}/300
    </div>
  </div>
);


const Leaderboard: React.FC = () => {

  const isLocked = true; 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortedUsers = [...ALL_USERS_MOCK].sort((a, b) => a.rank - b.rank);
  const topThree = sortedUsers.filter(user => user.rank <= 3);
  const allTableUsers = sortedUsers.filter(user => user.rank >= 4);

  const totalPages = Math.ceil(allTableUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTableData = allTableUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => { if (currentPage > 1 && !isLocked) setCurrentPage(prev => prev - 1); };
  const handleNext = () => { if (currentPage < totalPages && !isLocked) setCurrentPage(prev => prev + 1); };

  return (
    <div className={`${styles.pageWrapper} ${isLocked ? styles.locked : ""}`}>
      

      {isLocked && (
        <div className={styles.comingSoonOverlay}>
          <div className={styles.comingSoonCard}>
            <div className={styles.lockIcon}>
              <FiLock size={24} />
            </div>
            <h2 className={styles.comingSoonTitle}>Leaderboard Coming Soon</h2>
            <p className={styles.comingSoonText}>
              We are currently gathering data from the first batch of tests. 
              Rankings will go live shortly.
            </p>
            <div className={styles.statusBadge}>MVP Phase 1</div>
          </div>
        </div>
      )}


      <div className={isLocked ? styles.blurredContent : ""}>
        <div className={styles.themeWrapper}>
          <div className={styles.heroSection}>
            {topThree.map((user) => (
              <HeroCard key={`hero-${user.rank}`} user={user} />
            ))}
          </div>

          <div className={styles.userStatsPill}>
            <span className={styles.pillHighlight}>All India Rank: — #--</span> out of <span className={styles.pillHighlight}>---</span> students
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>JEE Main 2025 Leaderboard</div>
            </div>

            <div className={styles.gridTable} role="table">
              <div className={styles.gridHeader} role="rowgroup">
                <div>Rank</div>
                <div>Student Name</div>
                <div>Percentile</div>
                <div className={styles.hiddenMobile} style={{ textAlign: 'right' }}>Score</div>
              </div>
              {currentTableData.map((user) => (
                <TableRow key={`row-${user.rank}`} user={user} />
              ))}
            </div>

            <div className={styles.paginationContainer}>
              <button 
                className={styles.pageBtn} 
                onClick={handlePrev} 
                disabled={isLocked || currentPage === 1}
              >
                <FiChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <div className={styles.pageInfo}>
                Page <span>{currentPage}</span> of {totalPages}
              </div>
              <button 
                className={styles.pageBtn} 
                onClick={handleNext} 
                disabled={isLocked || currentPage === totalPages}
              >
                <span>Next</span>
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;