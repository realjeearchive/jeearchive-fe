export function getJeeDaysLeft(userClass?: string) {
  if (!userClass) return null;
  
  const normalizedClass = userClass.toLowerCase();
  
  // Ignore Class 10 or below
  if (normalizedClass.includes("10") || normalizedClass.includes("9") || normalizedClass === "other") {
    return null;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = Jan, 5 = June, etc.

  // In India, the academic year shifts around April (Month 3).
  const academicYearStart = currentMonth < 3 ? currentYear - 1 : currentYear;

  let targetExamYear;

  if (normalizedClass.includes("11")) {
    targetExamYear = academicYearStart + 2;
  } else if (normalizedClass.includes("12") || normalizedClass.includes("dropper")) {
    targetExamYear = academicYearStart + 1;
  } else {
    return null;
  }

  // Proxies for exam dates 
  const mains1Date = new Date(targetExamYear, 0, 15).getTime(); // Jan 15
  const mains2Date = new Date(targetExamYear, 3, 5).getTime();  // April 5
  const advDate = new Date(targetExamYear, 4, 25).getTime();    // May 25

  const msPerDay = 1000 * 60 * 60 * 24;
  const nowMs = now.getTime();
  
  const shortYear = targetExamYear.toString().slice(-2);

  // Return the closest upcoming exam
  if (nowMs < mains1Date) {
    return {
      days: Math.ceil((mains1Date - nowMs) / msPerDay),
      label: `JEE Mains`
    };
  } else if (nowMs < mains2Date) {
    return {
      days: Math.ceil((mains2Date - nowMs) / msPerDay),
      label: `JEE Mains`
    };
  } else if (nowMs < advDate) {
    return {
      days: Math.ceil((advDate - nowMs) / msPerDay),
      label: `JEE Advanced`
    };
  }

  // If all exams for their target year have passed
  return null;
}